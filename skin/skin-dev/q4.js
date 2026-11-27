(() => {
  const el = document.querySelector('.mavis-sidebar-card');
  const pick = (pe) => { const s = getComputedStyle(el, pe); return { content: s.content, display: s.display, position: s.position, w: s.width, h: s.height, top: s.top, right: s.right, z: s.zIndex, bg: s.backgroundImage.slice(0, 60), op: s.opacity, vis: s.visibility }; };
  const kids = [...el.children].map(c => { const s = getComputedStyle(c); return { cls: c.className.slice(0, 80), pos: s.position, z: s.zIndex, bg: s.backgroundColor }; });
  return { after: pick('::after'), before: pick('::before'), cardBg: getComputedStyle(el).backgroundColor, overflow: getComputedStyle(el).overflow, kids, hw: document.documentElement.getAttribute('data-hwskin') };
})()
