(() => { try {
  const seg = document.querySelector('[data-testid=conversation-source-segmented] .mavis-segmented') || document.querySelector('.mavis-segmented');
  const out = { html: seg ? seg.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '<svg/>').slice(0, 1400) : null, rules: [], lang: document.documentElement.lang, label: null };
  for (const sh of document.styleSheets) { let l; try { l = sh.cssRules; } catch { continue; } for (const r of l) { const t = r.cssText || ''; if (t.includes('mavis-segmented') && out.rules.length < 16) out.rules.push(t.slice(0, 520)); } }
  const lab = [...document.querySelectorAll('.mavis-sidebar-item span')].find((e) => e.textContent.trim() === '新建任务');
  if (lab) { const c = getComputedStyle(lab); out.label = { fam: c.fontFamily, w: c.fontWeight, stroke: c.webkitTextStrokeWidth, smooth: c.webkitFontSmoothing, synth: c.fontSynthesis, vs: c.fontVariationSettings, opt: c.fontOpticalSizing, shadow: c.textShadow, render: c.textRendering, kern: c.fontKerning, feat: c.fontFeatureSettings }; }
  const send = document.querySelector('[data-testid=send-button]'); const sc = send ? getComputedStyle(send) : null;
  out.send = sc ? { bg: sc.backgroundColor, rad: sc.borderRadius, cls: [...send.classList].join(' ').slice(0, 300), inner: [...send.children].map((e) => ({ tag: e.tagName, bg: getComputedStyle(e).backgroundColor, rad: getComputedStyle(e).borderRadius, r: (() => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; })() })) } : null;
  out.fontsReady = [...document.fonts].slice(0, 12).map((f) => `${f.family}|${f.weight}|${f.status}`);
  return out;
} catch (e) { return { error: String(e && e.stack || e) }; } })()
