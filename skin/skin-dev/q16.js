(async () => { try {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const trig = document.querySelector('[data-testid=model-selector-trigger]');
  trig.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); trig.click();
  await sleep(700);
  const pops = [...document.querySelectorAll('.ant-dropdown, .ant-popover, [role=menu], [role=listbox], .mavis-popover, [data-radix-popper-content-wrapper]')].filter((e) => e.getBoundingClientRect().width > 40);
  const info = pops.slice(0, 4).map((e) => { const c = getComputedStyle(e); const inner = e.querySelector('[class*=menu], [role=menu], div'); const ci = inner ? getComputedStyle(inner) : null; const r = e.getBoundingClientRect(); return { cls: [...e.classList].join(' ').slice(0, 100), r: [r.x, r.y, r.width, r.height].map(Math.round), bg: c.backgroundColor, innerBg: ci && ci.backgroundColor, color: c.color }; });
  return { n: pops.length, info };
} catch (e) { return { error: String(e && e.stack || e) }; } })()
