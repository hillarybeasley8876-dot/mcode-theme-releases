(() => { try {
  const R = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10); };
  const F = (el) => { if (!el) return null; const c = getComputedStyle(el); return { size: c.fontSize, w: c.fontWeight, lh: c.lineHeight, color: c.color, ls: c.letterSpacing, fam: c.fontFamily.slice(0, 40), bg: c.backgroundColor, rad: c.borderRadius }; };
  const leafText = (root) => { const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const s = n.textContent.trim(); if (!s) continue; const rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect(); out.push({ s: s.slice(0, 24), r: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10), f: F(n.parentElement) }); } return out; };
  const svgs = (root) => [...root.querySelectorAll('svg')].map((s) => ({ r: R(s), color: getComputedStyle(s).color, vb: s.getAttribute('viewBox'), html: s.innerHTML.slice(0, 420) }));
  const fixed = document.querySelector('[data-testid=electron-fixed-navigation]');
  const scroll = document.querySelector('[data-testid=electron-scrollable-navigation]');
  const seg = document.querySelector('[data-testid=conversation-source-segmented]');
  const pill = document.querySelector('[data-testid=home-upgrade-button]');
  const ws = document.querySelector('[data-testid=home-workspace-toolbar]');
  const user = document.querySelector('[data-testid=sidebar-user-menu-trigger]');
  const h1 = document.querySelector('.mavis-centered-prompt-identity h1');
  const after = h1 ? getComputedStyle(h1, '::after') : null;
  const side = document.querySelector('[data-testid=side-panel-button]');
  const send = document.querySelector('[data-testid=send-button]');
  const tb = document.querySelector('[data-testid=mavis-home-content] .mavis-message-input-card');
  const hdr = document.querySelector('header.windows-titlebar');
  return {
    navRows: [...(fixed ? fixed.querySelectorAll('.mavis-sidebar-item') : []), ...(scroll ? scroll.querySelectorAll('.mavis-sidebar-item') : [])].map((e) => ({ r: R(e), text: leafText(e), svg: svgs(e).map((s) => ({ r: s.r, color: s.color })) })),
    navSvg: [...(fixed ? fixed.querySelectorAll('.mavis-sidebar-item') : []), ...(scroll ? scroll.querySelectorAll('.mavis-sidebar-item') : [])].map((e) => svgs(e)[0]),
    cloudBtn: fixed ? svgs(fixed).slice(-1)[0] : null,
    seg: seg ? { r: R(seg), kids: [...seg.querySelectorAll('button, [role=tab], [role=radio], label')].slice(0, 6).map((e) => ({ r: R(e), f: F(e), text: leafText(e), svg: svgs(e).map((s) => s.r) })), inner: [...seg.children].map((e) => ({ r: R(e), f: F(e), cls: [...e.classList].join(' ').slice(0, 80) })) } : null,
    projLabel: (() => { const e = [...document.querySelectorAll('.mavis-sidebar-card *')].find((x) => x.children.length === 0 && x.textContent.trim() === '项目'); return e ? { r: R(e), f: F(e) } : null; })(),
    user: user ? { r: R(user), text: leafText(user), imgs: [...user.querySelectorAll('img')].map(R), svg: svgs(user).map((s) => s.r) } : null,
    divider: (() => { const e = user && user.parentElement; return e ? { r: R(e), bt: getComputedStyle(e).borderTop, parent: R(e.parentElement), pbt: getComputedStyle(e.parentElement).borderTop } : null; })(),
    pill: pill ? { r: R(pill), parent: R(pill.parentElement), text: leafText(pill.parentElement), svg: svgs(pill.parentElement).map((s) => ({ r: s.r, color: s.color, html: s.html })), pf: F(pill.parentElement) } : null,
    ws: ws ? { text: leafText(ws), svg: svgs(ws).map((s) => ({ r: s.r, color: s.color })) } : null,
    h1: { r: R(h1), after: after ? { size: after.fontSize, w: after.fontWeight, lh: after.lineHeight, ls: after.letterSpacing, width: after.width, fam: after.fontFamily.slice(0, 40) } : null },
    side: side ? { r: R(side), svg: svgs(side) } : null,
    send: send ? { r: R(send), kids: [...send.querySelectorAll('*')].slice(0, 4).map((e) => ({ tag: e.tagName, r: R(e), f: F(e) })) } : null,
    toolbarText: tb ? leafText(tb) : null, toolbarSvg: tb ? svgs(tb).map((s) => ({ r: s.r, color: s.color })) : null,
    hdr: hdr ? { logo: R(hdr.querySelector('img')), svgs: svgs(hdr).map((s) => ({ r: s.r, color: s.color, html: s.html })) } : null,
    sideBorder: getComputedStyle(document.querySelector('.mavis-sidebar-card')).borderRight,
  };
} catch (e) { return { error: String(e && e.stack || e) }; } })()
