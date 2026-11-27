(() => { try {
  const pick = (el) => { const c = getComputedStyle(el); return { w: c.fontWeight, stroke: c.webkitTextStrokeWidth, strokeColor: c.webkitTextStrokeColor, var: c.fontVariationSettings, smooth: c.webkitFontSmoothing, shadow: c.textShadow, synth: c.fontSynthesis, color: c.color, family: c.fontFamily, size: c.fontSize, opt: c.fontOpticalSizing, stretch: c.fontStretch }; };
  const lab = document.querySelector('[data-testid=home-recommendations] [data-recommendation-tab-label]');
  const strip = [...document.querySelectorAll('[data-testid=mavis-home-content] *')].filter(e => e.children.length === 0 && ['游戏', '本地'].includes((e.textContent || '').trim()));
  const rules = [];
  for (const sh of document.styleSheets) { let l; try { l = sh.cssRules; } catch { continue; } for (const r of l) { const t = r.cssText || ''; if (t.includes('typography-enabled') && (t.includes('stroke') || t.includes('font-weight') || t.includes('variation'))) rules.push(t.slice(0, 220)); } }
  return { label: pick(lab), strip: strip.map(e => ({ text: e.textContent.trim(), ...pick(e) })), rules: rules.slice(0, 10), lang: document.documentElement.lang };
} catch (e) { return { error: String(e) }; } })()
