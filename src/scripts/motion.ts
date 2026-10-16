/**
 * Nonessential motion. Loaded only when the visitor has not asked for
 * reduced motion. Scroll reveals run once. Pointer sway is event-driven,
 * not a continuous render.
 */
export {};

const reveals = document.querySelectorAll<HTMLElement>('.reveal');

if (reveals.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const node of reveals) {
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
    node.classList.add('reveal--wait');
    observer.observe(node);
  }
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer) {
  const root = document.documentElement;
  let x = 0;
  let y = 0;
  let frame = 0;

  const write = (): void => {
    frame = 0;
    root.style.setProperty('--px', x.toFixed(3));
    root.style.setProperty('--py', y.toFixed(3));
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX / window.innerWidth - 0.5;
      y = event.clientY / window.innerHeight - 0.5;
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(write);
    },
    { passive: true },
  );

  window.addEventListener('pointerleave', () => {
    x = 0;
    y = 0;
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(write);
  });
}
