(() => {
  const h = document.querySelector('.mavis-centered-prompt-identity h1');
  const cs = getComputedStyle(h), ca = getComputedStyle(h, '::after');
  const rules = [];
  for (const sh of document.styleSheets) {
    let list; try { list = sh.cssRules; } catch { continue; }
    for (const r of list) {
      if (r.selectorText && r.selectorText.includes('brand-slogan')) rules.push((r.cssText || '').slice(0, 260));
    }
  }
  return { fontSize: cs.fontSize, lineHeight: cs.lineHeight, afterContent: ca.content, afterFont: ca.fontSize, rules: rules.slice(0, 8) };
})()
