(() => { try {
  const R = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]; };
  const S = (el, ...props) => { if (!el) return null; const cs = getComputedStyle(el); const o = {}; for (const p of props) o[p] = cs[p]; return o; };
  const id = document.querySelector('.mavis-centered-prompt-identity');
  const h1 = id && id.querySelector('h1');
  const av = id && id.querySelector('[class~="group/avatar"]');
  const card = document.querySelector('[data-testid=mavis-home-content] .mavis-message-input-card');
  const ph = card && card.querySelector('[data-placeholder], p.is-editor-empty, .ProseMirror p');
  const tb = card && card.querySelector('[data-message-input-toolbar]');
  const kids = tb ? [...tb.querySelectorAll('button, [data-testid], span, svg')].filter(e => e.getBoundingClientRect().width > 0).slice(0, 24).map(e => ({ tag: e.tagName.toLowerCase(), tid: e.getAttribute('data-testid'), text: (e.textContent || '').trim().slice(0, 30), r: R(e) })) : [];
  const chips = [...document.querySelectorAll('[data-testid=home-recommendations] [role=tab]')].map(e => ({ text: e.textContent.trim(), r: R(e), svg: R(e.querySelector('svg')), label: R(e.querySelector('[data-recommendation-tab-label]')) }));
  const strip = [...document.querySelectorAll('[data-testid=mavis-home-content] *')].filter(e => e.children.length === 0 && ['游戏', '本地'].includes((e.textContent || '').trim()) && e.getBoundingClientRect().y > 480).map(e => ({ text: e.textContent.trim(), r: R(e), parentSvg: R(e.parentElement.querySelector('svg')) }));
  const up = document.querySelector('[data-testid=home-upgrade-button]');
  return {
    h1: R(h1), h1style: S(h1, 'fontFamily', 'fontWeight', 'fontSize', 'lineHeight'), after: S(h1 && h1, 'color'),
    avatar: R(av), card: R(card), cardStyle: S(card, 'borderRadius', 'backgroundColor', 'borderColor', 'boxShadow'),
    placeholder: ph ? { r: R(ph), style: S(ph, 'fontSize', 'color', 'fontFamily'), text: ph.getAttribute('data-placeholder') } : null,
    toolbar: R(tb), toolbarKids: kids, chips, strip, upgrade: R(up && up.parentElement), upgradeText: R(up),
    rootFont: getComputedStyle(document.documentElement).getPropertyValue('--mavis-font-family'),
  };
} catch (e) { return { error: String(e && e.stack || e) }; } })()