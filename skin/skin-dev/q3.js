(() => {
  const desc = (el) => {
    const r = el.getBoundingClientRect();
    const attrs = [...el.attributes].filter(a => a.name !== 'class' && a.name !== 'style' && a.name !== 'd' && !a.name.startsWith('aria-')).map(a => `${a.name}=${a.value.slice(0, 40)}`).join(' ');
    return `${el.tagName.toLowerCase()} .${[...el.classList].join('.').slice(0, 160)} [${attrs}] @${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`;
  };
  const chain = (el, n = 9) => { const out = []; while (el && n-- > 0 && el !== document.documentElement) { out.push(desc(el)); el = el.parentElement; } return out; };
  const byText = (t) => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.textContent.includes(t)) return n.parentElement; return null; };
  const q = {};
  for (const t of ['下午好', '新建任务', '问问 MCode', '升级套餐', '始终授权', 'EraPi0neer', '项目']) { const e = byText(t); q[t] = e ? chain(e) : null; }
  const ta = document.querySelector('textarea, [contenteditable=true]');
  q.input = ta ? chain(ta, 7) : null;
  const img = [...document.images].find(i => { const r = i.getBoundingClientRect(); return r.width > 30 && r.width < 80 && r.y < 400 && r.x > 600; });
  q.avatar = img ? chain(img, 5) : null;
  return q;
})()
