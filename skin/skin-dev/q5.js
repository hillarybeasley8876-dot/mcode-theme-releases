(async () => {
  const el = document.querySelector('.mavis-sidebar-card');
  const urls = { after: getComputedStyle(el, '::after').backgroundImage, before: getComputedStyle(el, '::before').backgroundImage };
  const out = {};
  for (const [k, v] of Object.entries(urls)) {
    const src = v.slice(5, -2);
    const img = new Image();
    try { img.src = src; await img.decode(); out[k] = { ok: true, w: img.naturalWidth, h: img.naturalHeight }; }
    catch (e) { out[k] = { ok: false, err: String(e), head: atob(src.split(',')[1]).slice(0, 120) }; }
  }
  return out;
})()
