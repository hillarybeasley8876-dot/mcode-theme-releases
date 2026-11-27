(() => {
  const r = document.documentElement, cs = getComputedStyle(r);
  const sheets = [...document.styleSheets].map(s => { try { return { href: s.href, rules: s.cssRules.length, first: s.cssRules[0] && s.cssRules[0].cssText.slice(0, 80) }; } catch (e) { return { href: s.href, err: String(e) }; } });
  return {
    cls: r.className, hw: r.getAttribute('data-hwskin'), style: r.getAttribute('style'),
    gray1000: cs.getPropertyValue('--gray_1000'), blue500: cs.getPropertyValue('--blue_500'),
    bgPrimary: cs.getPropertyValue('--bg_default_primary'), bodyBg: getComputedStyle(document.body).backgroundColor,
    colorScheme: cs.colorScheme, nSheets: sheets.length, sheets: sheets.slice(-4),
  };
})()
