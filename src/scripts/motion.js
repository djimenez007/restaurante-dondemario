// Content remains visible when JavaScript or animation APIs are unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactScreen = window.matchMedia('(max-width: 980px)');
const active = new Map();

export function animateEntrance(element, delay = 0) {
  if (!element || reducedMotion.matches || !element.animate) return;
  const bounds = element.getBoundingClientRect();
  if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

  active.get(element)?.cancel();
  const animation = element.animate([
    { opacity: 0, transform: `translateY(${compactScreen.matches ? 12 : 22}px)` },
    { opacity: 1, transform: 'translateY(0)' },
  ], {
    duration: compactScreen.matches ? 420 : 620,
    delay: compactScreen.matches ? Math.min(delay, 60) : delay,
    easing: 'cubic-bezier(.23,1,.32,1)',
    fill: 'backwards',
  });
  active.set(element, animation);
  const cleanup = () => {
    if (active.get(element) === animation) active.delete(element);
  };
  animation.onfinish = cleanup;
  animation.oncancel = cleanup;
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    let index = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      // Reveal once; never hide sections while the visitor scrolls back up.
      observer.unobserve(entry.target);
      animateEntrance(entry.target, Math.min(index++ * 55, 165));
    }
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal, .menu-head, .tabs, .menu-foot, .loc-pick, .loc-info, .foot-grid > div').forEach((element) => {
    // Leave initially visible content and anchor destinations immediately readable.
    if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    observer.disconnect();
    for (const animation of active.values()) animation.cancel();
    active.clear();
  });
}
