// CMS text fields are plain text; render a tiny bit of inline markdown (`code`, **bold**).
// Escape HTML first so the text can't inject tags, then add our own.
export const inlineMd = (s = '') => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
