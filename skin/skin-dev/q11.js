(() => { try {
  const R = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]; };
  const tids = [...document.querySelectorAll('[data-testid]')].map(e => ({ t: e.getAttribute('data-testid'), tag: e.tagName.toLowerCase(), r: R(e), cls: [...e.classList].join(' ').slice(0, 110) })).filter(o => o.r[2] > 0);
  const mavis = {};
  for (const e of document.querySelectorAll('[class*="mavis-"]')) for (const c of e.classList) if (c.startsWith('mavis-') && !mavis[c]) mavis[c] = R(e);
  return { tids, mavis, title: document.title, body: [...document.body.children].map(e => e.tagName + '#' + e.id + '.' + [...e.classList].join('.').slice(0, 60)) };
} catch (e) { return { error: String(e && e.stack || e) }; } })()
