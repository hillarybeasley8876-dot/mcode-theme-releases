(() => {
  const s = document.documentElement.style, out = {};
  for (let i = 0; i < s.length; i++) { const k = s[i]; if (k.startsWith('--')) out[k] = s.getPropertyValue(k).trim(); }
  return out;
})()
