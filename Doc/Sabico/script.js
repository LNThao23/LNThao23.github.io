const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.classList.toggle('is-open', open);
});

menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));

// Keep the gentle movement separate from the entrance and hover transforms.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let swayAnimations = [];

function updateSway() {
  swayAnimations.forEach(animation => animation.cancel());
  swayAnimations = [];
  if (motionPreference.matches) return;

  const floatingPieces = [
    ['.product-stage .broth-layer', 2, 0.2, 6200],
    ['.product-stage .cartons', 4, 0.45, 4800],
    ['.product-stage .cup-tomyum', 5, -0.7, 4300],
    ['.product-stage .cup-beef', 4, 0.6, 5100],
    ['.product-stage .cup-chicken', 5, -0.5, 4700],
    ['.product-stage .bowl', 3, 0.25, 5700],
    ['.product-stage .condiment', 3, -0.4, 5300],
    ['.flavor-card img', 3, 0.35, 5600]
  ];

  floatingPieces.forEach(([selector, distance, angle, duration], group) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      swayAnimations.push(element.animate([
        { translate: `0 ${distance}px`, rotate: `${-angle}deg` },
        { translate: `0 ${-distance}px`, rotate: `${angle}deg` }
      ], {
        duration,
        delay: (group + index) * 120,
        direction: 'alternate',
        iterations: Infinity,
        easing: 'ease-in-out'
      }));
    });
  });
}

if (document.readyState === 'complete') updateSway();
else window.addEventListener('load', updateSway, { once: true });
motionPreference.addEventListener('change', () => {
  if (document.readyState === 'complete') updateSway();
});
