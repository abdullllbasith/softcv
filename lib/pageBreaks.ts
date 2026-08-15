/**
 * Soft page-break helpers for canvas-sliced A4 preview + PDF.
 * Inserts padding so .resume-section / .resume-entry blocks don't straddle page edges.
 */

export function clearPageGuards(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-page-guard]').forEach((el) => {
    el.style.paddingTop = '';
    el.removeAttribute('data-page-guard');
  });
}

function offsetTopWithin(root: HTMLElement, el: HTMLElement): number {
  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  // Prefer offset-chain math — getBoundingClientRect can jitter under transform:scale
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    top += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    if (parent && !root.contains(parent) && parent !== root) {
      return elRect.top - rootRect.top + root.scrollTop;
    }
    node = parent;
  }
  if (node === root) return top;
  return elRect.top - rootRect.top + root.scrollTop;
}

/**
 * Push blocks that would be cut by a page boundary onto the next page.
 * Prefer smaller `.resume-entry` blocks first so large sections can split cleanly.
 * Returns true if any padding value changed (layout may have shifted).
 */
export function applyPageBreakGuards(root: HTMLElement, contentPageH: number): boolean {
  if (contentPageH <= 0) {
    const had = root.querySelector('[data-page-guard]');
    clearPageGuards(root);
    return Boolean(had);
  }

  // Compute target pads from a clean layout, then apply only if different.
  const prevPads = new Map<HTMLElement, string>();
  root.querySelectorAll<HTMLElement>('[data-page-guard]').forEach((el) => {
    prevPads.set(el, el.style.paddingTop);
  });
  clearPageGuards(root);

  const collect = () => [
    ...Array.from(root.querySelectorAll<HTMLElement>('.resume-entry')),
    ...Array.from(root.querySelectorAll<HTMLElement>('.resume-section')),
  ];

  const nextPads = new Map<HTMLElement, string>();

  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (const el of collect()) {
      if (nextPads.has(el)) continue;

      const y = offsetTopWithin(root, el);
      const h = el.offsetHeight;
      if (h <= 0 || h > contentPageH - 12) continue;

      const posInPage = ((y % contentPageH) + contentPageH) % contentPageH;
      const remaining = contentPageH - posInPage;

      if (posInPage <= 6) continue;

      if (h > remaining - 6) {
        const pad = `${Math.ceil(remaining)}px`;
        el.style.paddingTop = pad;
        el.setAttribute('data-page-guard', '1');
        nextPads.set(el, pad);
        changed = true;
      }
    }
    if (!changed) break;
    void root.offsetHeight;
  }

  let changed = prevPads.size !== nextPads.size;
  if (!changed) {
    for (const [el, pad] of nextPads) {
      if (prevPads.get(el) !== pad) {
        changed = true;
        break;
      }
    }
  }
  if (!changed) {
    for (const el of prevPads.keys()) {
      if (!nextPads.has(el)) {
        changed = true;
        break;
      }
    }
  }
  return changed;
}
