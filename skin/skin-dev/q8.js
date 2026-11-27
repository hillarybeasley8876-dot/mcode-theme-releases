(() => { try {
  const chip = document.querySelector('[data-testid=home-recommendations] [role=tab]');
  const cs = getComputedStyle(chip);
  const lab = chip.querySelector('[data-recommendation-tab-label]'); const ls = getComputedStyle(lab);
  const tag = [...chip.querySelectorAll('span,div')].find(e => e.textContent.trim() === 'H3');
  const ts = tag && getComputedStyle(tag);
  const p = document.querySelector('[data-testid=mavis-home-content] .ProseMirror p');
  const pb = p && getComputedStyle(p, '::before');
  const perm = document.querySelector('[data-testid=permission-mode-label]'); const ps = getComputedStyle(perm);
  const model = document.querySelector('[data-testid=model-selector-trigger] span'); const ms = getComputedStyle(model);
  const send = document.querySelector('[data-testid=send-button]'); const ss = getComputedStyle(send.firstElementChild || send);
  return {
    chip: { border: cs.border, radius: cs.borderRadius, bg: cs.backgroundColor, color: cs.color },
    label: { size: ls.fontSize, weight: ls.fontWeight, color: ls.color, family: ls.fontFamily },
    tag: ts && { size: ts.fontSize, color: ts.color, bg: ts.backgroundColor, radius: ts.borderRadius, rect: tag.getBoundingClientRect().toJSON() },
    ph: pb && { content: pb.content, color: pb.color, size: pb.fontSize },
    perm: { size: ps.fontSize, color: ps.color, weight: ps.fontWeight },
    model: { size: ms.fontSize, color: ms.color, weight: ms.fontWeight },
    send: { bg: ss.backgroundColor, radius: ss.borderRadius, rect: (send.firstElementChild || send).getBoundingClientRect().toJSON() },
  };
} catch (e) { return { error: String(e) }; } })()
