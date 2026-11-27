(() => { try {
  const info = (e) => { const c = getComputedStyle(e), b = getComputedStyle(e, '::before'), a = getComputedStyle(e, '::after'); return { tag: e.tagName.toLowerCase(), cls: [...e.classList].join(' ').slice(0, 150), bg: c.backgroundColor, bgi: c.backgroundImage.slice(0, 60), op: c.opacity, filter: c.filter, bf: c.backdropFilter, mix: c.mixBlendMode, before: b.content !== 'none' ? { bg: b.backgroundColor, bgi: b.backgroundImage.slice(0, 50) } : null, after: a.content !== 'none' ? { bg: a.backgroundColor, bgi: a.backgroundImage.slice(0, 50) } : null }; };
  return { at130_56: document.elementsFromPoint(130, 56).slice(0, 12).map(info), at120_340: document.elementsFromPoint(120, 340).slice(0, 6).map(info) };
} catch (e) { return { error: String(e && e.stack || e) }; } })()
