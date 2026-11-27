(() => { try {
  const S = (sel, props) => { const el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el) return null; const cs = getComputedStyle(el); const o = {}; for (const p of props) o[p] = cs[p]; const r = el.getBoundingClientRect(); o.rect = [r.x, r.y, r.width, r.height].map(v => Math.round(v * 10) / 10); o.cls = [...el.classList].join(' ').slice(0, 200); return o; };
  const P = ['backgroundColor', 'backgroundImage', 'position', 'zIndex', 'overflow', 'opacity', 'borderRadius', 'boxShadow', 'borderColor'];
  const hdr = document.querySelector('header.windows-titlebar');
  const out = {
    header: S(hdr, P), headerKids: hdr ? [...hdr.querySelectorAll('*')].slice(0, 30).map(e => ({ tag: e.tagName.toLowerCase(), cls: [...e.classList].join(' ').slice(0, 120), r: (() => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round); })(), bg: getComputedStyle(e).backgroundColor })) : null,
    headerRules: [],
    sidebar: S('.mavis-sidebar-card', P), homeBody: S('[data-testid="home-panel-body"]', P), homeContent: S('[data-testid="mavis-home-content"]', P),
    body: S(document.body, P), root: S('body > div.w-full.h-screen', P),
    toggle: S('[data-testid="mavis-sidebar-toggle"]', ['color', 'zIndex', 'position']),
    toggleChain: (() => { let e = document.querySelector('[data-testid="mavis-sidebar-toggle"]'); const o = []; let n = 8; while (e && n-- > 0) { const cs = getComputedStyle(e); o.push({ tag: e.tagName.toLowerCase(), cls: [...e.classList].join(' ').slice(0, 140), pos: cs.position, z: cs.zIndex, bg: cs.backgroundColor }); e = e.parentElement; } return o; })(),
    identity: S('.mavis-centered-prompt-identity', ['display']), h1: S('.mavis-centered-prompt-identity h1', ['fontSize', 'lineHeight', 'fontWeight', 'fontFamily', 'color', 'letterSpacing']),
    h1text: (document.querySelector('.mavis-centered-prompt-identity h1') || {}).textContent,
    avatar: S('.mavis-centered-prompt-identity [class~="group/avatar"]', ['borderRadius', 'overflow', 'position']),
    avatarHtml: (document.querySelector('.mavis-centered-prompt-identity [class~="group/avatar"]') || {}).outerHTML?.slice(0, 900),
    card: S('[data-testid="mavis-home-content"] .mavis-message-input-card', ['backgroundColor', 'borderRadius', 'boxShadow', 'borderColor', 'borderWidth', 'position', 'overflow']),
    wsToolbar: S('[data-testid="home-workspace-toolbar"]', ['backgroundColor']),
    wsParent: (() => { const e = document.querySelector('[data-testid="home-workspace-toolbar"]'); return e ? S(e.parentElement, ['backgroundColor', 'borderRadius', 'boxShadow', 'padding']) : null; })(),
    upgrade: S('[data-testid="home-upgrade-button"]', ['backgroundColor', 'color', 'borderRadius']),
    upgradeParent: (() => { const e = document.querySelector('[data-testid="home-upgrade-button"]'); return e ? S(e.parentElement, ['backgroundColor', 'borderRadius']) : null; })(),
    sidePanelBtn: S('[data-testid="side-panel-button"]', ['color']),
  };
  for (const sh of document.styleSheets) { let l; try { l = sh.cssRules; } catch { continue; } for (const r of l) { const t = r.cssText || ''; if (t.includes('windows-titlebar') && out.headerRules.length < 14) out.headerRules.push(t.slice(0, 420)); } }
  return out;
} catch (e) { return { error: String(e && e.stack || e) }; } })()
