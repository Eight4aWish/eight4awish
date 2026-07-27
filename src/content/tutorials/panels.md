---
title: Front panels with build123d
eyebrow: Panels as code
date: 2026-07-11
summary: >-
  Describe a panel in Python — jacks, knobs, labels — and get the model and an
  STL to print. Every panel on this site is made this way.
graphic: /renders/tut_panels.png
chips:
  - Python
  - STL / STEP
repo: https://github.com/Eight4aWish
order: 2
draft: true
songs: []
---
## Why write a panel instead of drawing one

A panel is a grid of holes with labels on it — which is to say, it is a few numbers and a loop. Draw
it by hand and every change is a redraw. Write it in Python and changing the HP, moving a jack row or
renaming a label is a one-line edit, and the STL falls out of the same file.

The 3D view on the card above is this repository's own output: the panel, jacks, nuts, trimmers and
labels, exactly as the code emits them.
