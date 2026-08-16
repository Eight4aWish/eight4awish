#!/usr/bin/env python3
"""Build a Bastl Wave Bard draft (.wavebard) from folders of WAV files.

Each input folder becomes one bank; the WAVs inside it become that bank's
samples, in filename order. The resulting draft is dropped onto the Wave Bard
Sample Loader web app, which does the sample-rate/bit-depth conversion and
generates the .uf2 firmware.

    python3 tools/wavebard_pack.py out/banks/* -o my-kit.wavebard

The script also reports how much of the Bard's 7.5 MB sample memory the pack
will use once converted, which is the constraint that actually decides how much
material fits.

Format details (magic 'k2wb', 7.5 MB budget, 8-char labels, equal sample count
per bank) are taken from bastl-instruments/kastle2-webapps, MIT licensed.
See WAVE_BARD_MASCHINE.md for the wider pipeline this fits into.
"""

import argparse
import json
import re
import struct
import sys
import unicodedata
import uuid
import zipfile
from pathlib import Path

# --- Wave Bard limits, from kastle2-webapps/wave-bard-sample-loader/src/config.js
MEMORY_SIZE = int(7.5 * 1024 * 1024)
SAMPLE_RATES = (44100, 22050, 11025)
BIT_DEPTH = 16
MIN_BANKS, MAX_BANKS = 1, 32
MIN_SAMPLES, MAX_SAMPLES = 3, 32
LABEL_BYTES = 8  # what actually survives into the firmware

MAIN_HEADER = 20
BANK_HEADER = 12
SAMPLE_HEADER = 16
END_MARKER = 4

# Bank colours the app knows by name (data/bankColors.js), cycled per bank.
BANK_COLORS = [
    {"display": "#FF0000", "real": "#CC0000", "name": "Red"},
    {"display": "#FFA500", "real": "#FFA500", "name": "Orange"},
    {"display": "#FFD700", "real": "#E6BE00", "name": "Gold"},
    {"display": "#CCFF11", "real": "#66AA11", "name": "Yellow"},
    {"display": "#00FF00", "real": "#00FF00", "name": "Green"},
    {"display": "#00A0A0", "real": "#006666", "name": "Teal"},
    {"display": "#00FFFF", "real": "#00FFFF", "name": "Cyan"},
    {"display": "#3333FF", "real": "#0000FF", "name": "Blue"},
    {"display": "#800080", "real": "#660066", "name": "Purple"},
    {"display": "#FF00FF", "real": "#D000D0", "name": "Magenta"},
    {"display": "#FF0066", "real": "#770022", "name": "Raspberry"},
    {"display": "#DDDDEE", "real": "#558899", "name": "White"},
]

# Defaults the app itself ships with (data/scales.js, data/rhythms.js).
SCALES = [
    ("Minor Chord", 0b000010001001),
    ("Minor Pentatonic", 0b010010101001),
    ("Minor Diatonic", 0b010110101101),
    ("Chromatic", 0b111111111111),
    ("Major Diatonic", 0b101010110101),
    ("Major Pentatonic", 0b001010010101),
    ("Major Chord", 0b000010010001),
]
RHYTHMS = [
    0b1000000010000000, 0b1000100010001000, 0b1000001000001000, 0b1001001001001001,
    0b1000100010010000, 0b1000100010101000, 0b0010001000110010, 0b1000100101101000,
    0b1110000010000000, 0b1100110010001000, 0b1000110011101111, 0b1001100110011001,
    0b1001001000101000, 0b0111011101110111, 0b1111111100000000, 0b1111101010111010,
]


def clean_name(filename):
    """Same transform the web app applies to dropped filenames (utils/cleanName.js)."""
    stem = re.sub(r"\.[^/.]+$", "", filename)
    stem = unicodedata.normalize("NFD", stem)
    stem = "".join(c for c in stem if not unicodedata.combining(c))
    return re.sub(r"[^a-zA-Z0-9]+", "_", stem.lower())[:32]


def read_wav(path):
    """Walk the RIFF chunks for format and data size. No decoding, no libraries."""
    raw = path.read_bytes()
    if raw[0:4] != b"RIFF" or raw[8:12] != b"WAVE":
        raise ValueError(f"{path.name}: not a RIFF/WAVE file")

    fmt = None
    data_bytes = None
    offset = 12
    while offset + 8 <= len(raw):
        chunk_id = raw[offset:offset + 4]
        (size,) = struct.unpack_from("<I", raw, offset + 4)
        body = offset + 8
        if chunk_id == b"fmt ":
            audio_format, channels, rate, _, _, bits = struct.unpack_from("<HHIIHH", raw, body)
            fmt = (audio_format, channels, rate, bits)
        elif chunk_id == b"data":
            data_bytes = min(size, len(raw) - body)
        offset = body + size + (size & 1)

    if fmt is None or data_bytes is None:
        raise ValueError(f"{path.name}: missing fmt or data chunk")

    audio_format, channels, rate, bits = fmt
    frame_bytes = channels * max(bits, 8) // 8
    return {
        "raw": raw,
        "sampleRate": rate,
        "bitDepth": bits,
        "channels": channels,
        "audioFormat": audio_format,
        "frames": data_bytes // frame_bytes if frame_bytes else 0,
        "duration": (data_bytes / frame_bytes) / rate if frame_bytes and rate else 0.0,
    }


def sample_bytes(info, rate, force_mono):
    """Bytes this sample costs in the firmware once converted, header included."""
    channels = 1 if force_mono else info["channels"]
    frames = round(info["duration"] * rate)
    payload = frames * channels * (BIT_DEPTH // 8)
    payload += (4 - payload % 4) % 4  # the writer pads each sample to 4 bytes
    return SAMPLE_HEADER + payload


def collect_banks(folders, samples_per_bank, truncate):
    banks = []
    for folder in folders:
        wavs = sorted(p for p in folder.iterdir() if p.suffix.lower() == ".wav")
        if not wavs:
            print(f"warning: {folder} holds no .wav files, skipping", file=sys.stderr)
            continue
        banks.append({"folder": folder, "files": wavs})

    if not banks:
        raise SystemExit("error: no banks to build")
    if len(banks) > MAX_BANKS:
        raise SystemExit(f"error: {len(banks)} banks, the Bard takes at most {MAX_BANKS}")

    counts = {len(b["files"]) for b in banks}
    target = samples_per_bank or min(counts)
    if not MIN_SAMPLES <= target <= MAX_SAMPLES:
        smallest = min(banks, key=lambda b: len(b["files"]))
        raise SystemExit(
            f"error: {target} samples per bank is outside the allowed {MIN_SAMPLES}-{MAX_SAMPLES} "
            f"(smallest bank is {smallest['folder'].name} with {len(smallest['files'])})"
        )
    if len(counts) > 1 and not truncate and not samples_per_bank:
        raise SystemExit(
            "error: every bank must hold the same number of samples "
            f"(found {sorted(counts)}). Pass --samples-per-bank N or --truncate."
        )

    for bank in banks:
        if len(bank["files"]) < target:
            raise SystemExit(
                f"error: {bank['folder'].name} has {len(bank['files'])} samples, needs {target}"
            )
        if len(bank["files"]) > target:
            print(f"note: {bank['folder'].name}: keeping first {target} of "
                  f"{len(bank['files'])} samples", file=sys.stderr)
        bank["files"] = bank["files"][:target]
    return banks, target


def build_draft(banks, rate, force_mono, name, processing):
    draft_banks = []
    for index, bank in enumerate(banks):
        samples = []
        for path in bank["files"]:
            info = bank["info"][path]
            samples.append({
                "id": str(uuid.uuid4()),
                "label": clean_name(path.name),
                "stereo": False if force_mono else info["channels"] != 1,
                "original": {
                    "soundData": list(info["raw"]),
                    "size": len(info["raw"]),
                    "duration": info["duration"],
                    "info": {
                        "format": "WAV",
                        "sampleRate": info["sampleRate"],
                        "bitDepth": info["bitDepth"],
                        "channels": info["channels"],
                    },
                },
            })
        draft_banks.append({
            "id": str(uuid.uuid4()),
            "label": bank["folder"].name[:LABEL_BYTES].upper(),
            "color": BANK_COLORS[index % len(BANK_COLORS)],
            "samples": samples,
        })

    return {
        "bitDepth": BIT_DEPTH,
        "sampleRate": rate,
        "name": name,
        "audioProcessing": processing,
        "sequencerLength": 16,
        "scales": [{"id": str(uuid.uuid4()), "name": n, "semitones": s} for n, s in SCALES],
        "rhythms": [{"id": str(uuid.uuid4()), "steps": s} for s in RHYTHMS],
        "banks": draft_banks,
    }


def report(banks, target, rate, force_mono):
    fixed = MAIN_HEADER + END_MARKER + len(SCALES) * 4 + len(RHYTHMS) * 4
    print(f"\n{len(banks)} banks x {target} samples = {len(banks) * target} slots\n")
    print(f"{'bank':<18}{'samples':>8}{'seconds':>10}{'KB @ target':>14}")
    total = fixed
    for bank in banks:
        used = BANK_HEADER + sum(sample_bytes(bank["info"][p], rate, force_mono)
                                 for p in bank["files"])
        seconds = sum(bank["info"][p]["duration"] for p in bank["files"])
        total += used
        print(f"{bank['folder'].name[:17]:<18}{len(bank['files']):>8}"
              f"{seconds:>10.2f}{used / 1024:>14.1f}")

    pct = 100 * total / MEMORY_SIZE
    channels = "mono" if force_mono else "as-is"
    print(f"\ntotal at {rate} Hz {channels}: {total / 1024 / 1024:.2f} MB of 7.50 MB ({pct:.0f}%)")
    if total > MEMORY_SIZE:
        print("OVER BUDGET - drop a bank, shorten samples, or use a lower rate", file=sys.stderr)

    print("\nsame pack at other settings:")
    for other in SAMPLE_RATES:
        for mono in (True, False):
            size = fixed + sum(
                BANK_HEADER + sum(sample_bytes(b["info"][p], other, mono) for p in b["files"])
                for b in banks)
            flag = "  <-- over" if size > MEMORY_SIZE else ""
            print(f"  {other:>6} Hz {'mono ' if mono else 'as-is'}: "
                  f"{size / 1024 / 1024:>5.2f} MB{flag}")
    return total


def check_labels(banks):
    for bank in banks:
        seen = {}
        for path in bank["files"]:
            short = clean_name(path.name)[:LABEL_BYTES]
            if short in seen:
                print(f"warning: {bank['folder'].name}: '{path.name}' and '{seen[short]}' both "
                      f"show as '{short}' on the Bard", file=sys.stderr)
            seen[short] = path.name


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("folders", nargs="+", type=Path, help="one folder per bank")
    parser.add_argument("-o", "--output", type=Path, default=Path("draft.wavebard"))
    parser.add_argument("--rate", type=int, choices=SAMPLE_RATES, default=44100,
                        help="playback rate the pack is built for (default: 44100)")
    parser.add_argument("--mono", action="store_true",
                        help="fold every sample to mono, halving the memory it costs")
    parser.add_argument("--samples-per-bank", type=int,
                        help="force this many samples per bank (banks must all match)")
    parser.add_argument("--truncate", action="store_true",
                        help="trim every bank to the size of the smallest one")
    parser.add_argument("--name", default="Default", help="pack name shown in the app")
    parser.add_argument("--trim-db", type=float, default=None,
                        help="ask the app to trim audio quieter than this, e.g. -48")
    parser.add_argument("--normalize-db", type=float, default=None,
                        help="ask the app to maximise volume to this, e.g. -0.1")
    parser.add_argument("--dry-run", action="store_true", help="report only, write nothing")
    args = parser.parse_args()

    folders = [f for f in args.folders if f.is_dir()]
    if not folders:
        raise SystemExit("error: no input folders")

    banks, target = collect_banks(folders, args.samples_per_bank, args.truncate)
    for bank in banks:
        bank["info"] = {}
        for path in bank["files"]:
            info = read_wav(path)
            if info["audioFormat"] not in (1, 3, 0xFFFE):
                print(f"warning: {path.name}: unusual WAV encoding {info['audioFormat']}",
                      file=sys.stderr)
            bank["info"][path] = info

    check_labels(banks)
    report(banks, target, args.rate, args.mono)
    if args.dry_run:
        return

    processing = {
        "fadeIn": True, "fadeInSeconds": 0.005,
        "fadeOut": True, "fadeOutSeconds": 0.005,
        "trim": args.trim_db is not None, "trimDbs": args.trim_db if args.trim_db else -48,
        "normalize": args.normalize_db is not None,
        "normalizeDbs": args.normalize_db if args.normalize_db else -0.1,
    }
    draft = build_draft(banks, args.rate, args.mono, args.name, processing)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.output, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("data.json", json.dumps(draft))
    print(f"\nwrote {args.output} ({args.output.stat().st_size / 1024 / 1024:.2f} MB)")
    print("drop it on https://apps.bastl-instruments.com/wave-bard-sample-loader/ "
          "and generate the firmware")


if __name__ == "__main__":
    main()
