const rolls = [
 ['BBQ pork roll','$9','BBQ pork, pâté, pickled carrot, cucumber, coriander, chilli, BBQ sauce'],
 ['Pork roll','$9','Sliced pork, pâté, pickled carrot, cucumber, coriander, chilli, and sauce'],
 ['Chicken roll','$10','Chicken, pâté, pickled carrot, sliced tomato, cucumber, coriander, chilli, and sauce'],
 ['Ham cheese salad roll','$8','Ham, cheese, lettuce, tomato, carrot and fresh salad vegetables.'],
 ['Cheese salad roll','$7','Cheese, lettuce, tomato, carrot and fresh salad vegetables'],
 ['Bacon and egg roll','$8','Bacon, egg, fresh lettuce and tomato, with sauce']
];
const savoury = [['Mushroom meat pie','$5.20'],['Meat pie','$5'],['Beef pastie','$5'],['Chicken pastie','$5'],['Pizza','$2.50'],['Frankie onion roll','$6'],['Sausage roll','$4']];
const sweet = [['Chocolate muffin'],['Apple muffin'],['Blueberry muffin'],['Hedgehode'],['Flamington'],['Vanilla slice'],['Cheese stick'],['Jam donut'],['Cream donut'],['Eclair'],['Chocolate Finger'],['Shell cookie'],['Blueberry danish'],['Apricot danish'],['Escargot'],['Custard tart'],['Cookie'],['Cookie-1','Cookie'],['Cookie-2','Cookie'],['Cookie-3','Cookie'],['Custard'],['Apple turnover'],['Chocolate croissant']];
const img = (folder, name) => `<img src="${folder}/${name}.svg" alt="${name.replace(/-\d$/, '')}" loading="lazy">`;
document.querySelector('#roll-grid').innerHTML = rolls.map(([name,price,description])=>`<article class="roll-card"><div class="roll-image">${img('Rolls',name)}</div><div class="roll-copy"><strong class="roll-price">${price}</strong><div><h3>${name}</h3><p>${description}</p></div></div></article>`).join('');
document.querySelector('#savoury-grid').innerHTML = savoury.map(([name,price])=>`<article class="product"><div class="product-image">${img('Savoury',name)}</div><h3>${name}</h3><strong>${price}</strong></article>`).join('');
document.querySelector('#sweet-grid').innerHTML = sweet.map(([name,label])=>`<article class="product"><div class="product-image">${img('Sweet',name)}</div><h3>${label || name}</h3></article>`).join('');
const searchForm = document.querySelector('.header-search');
const searchInput = document.querySelector('#menu-search');
const searchToggle = document.querySelector('.search-toggle');
const mobileLayout = window.matchMedia('(max-width: 750px)');

function setSearchOpen(open) {
 searchForm.classList.toggle('is-open', open);
 searchToggle.setAttribute('aria-expanded', String(open));
 searchToggle.setAttribute('aria-label', open ? 'Close search' : 'Open search');
 if (open) searchInput.focus();
}
searchToggle.addEventListener('click', () => setSearchOpen(searchToggle.getAttribute('aria-expanded') !== 'true'));
searchForm.addEventListener('keydown', event => {
 if (event.key === 'Escape' && mobileLayout.matches) {
  setSearchOpen(false);
  searchToggle.focus();
 }
});
const searchStatus = document.querySelector('#search-status');
const menuSections = [...document.querySelectorAll('#rolls, #savoury, #sweet')];
const normalizeSearch = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function filterMenu() {
 const query = searchInput.value.trim();
 const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
 let total = 0;
 menuSections.forEach(section => {
  let visible = 0;
  section.querySelectorAll('article').forEach(card => {
   const text = normalizeSearch(`${section.querySelector('h2').textContent} ${card.textContent}`);
   const matches = terms.every(term => text.includes(term));
   card.hidden = !matches;
   if (matches) visible++;
  });
  section.hidden = visible === 0;
  total += visible;
 });
 searchStatus.hidden = !query;
 searchStatus.textContent = query
  ? (total ? `${total} menu item${total === 1 ? '' : 's'} found for “${query}”.` : `No menu items found for “${query}”. Try another search.`)
  : '';
}

searchInput.addEventListener('input', filterMenu);
searchForm.addEventListener('submit', event => {
 event.preventDefault();
 filterMenu();
 const target = searchInput.value.trim() ? searchStatus : document.querySelector('#menu');
 target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});

// Keep the same slide element as it travels from the hero into its menu card.
const heroAnchor = document.querySelector('.hero-image-anchor');
const heroImage = document.querySelector('.hero-image');
const heroSlides = [...heroImage.querySelectorAll('img')];
const heroFoodName = heroImage.querySelector('.hero-food-name');
const heroFoodNames = ['BBQ Pork Roll', 'Sausage Roll', 'Eclair'];
const heroCategoryNames = ['Rolls', 'Savoury', 'Sweet'];
const heroDots = [...document.querySelectorAll('.hero-pagination button')];
const categoryImages = [...document.querySelectorAll('.category-image')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const HERO_SLIDE_INTERVAL = 4000;
let activeSlide = 0;
let scrollProgress = 0;
let previousScrollY = window.scrollY;
let returningToTop = false;
let heroGeometry;
let animationFrame = 0;

function measureHero() {
 const source = heroAnchor.getBoundingClientRect();
 heroGeometry = {
  source: { left: source.left, top: source.top + window.scrollY, width: source.width, height: source.height },
  targets: categoryImages.map(slot => {
   const rect = slot.getBoundingClientRect();
   return { left: rect.left, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
  }),
  start: document.querySelector('.hero').offsetTop + document.querySelector('.hero').offsetHeight / 2
 };
 scheduleHero();
}

function dockHero(parent) {
 if (heroImage.parentElement !== parent) parent.appendChild(heroImage);
 heroImage.classList.remove('is-travelling');
 heroImage.style.cssText = '';
}

function renderHero() {
 animationFrame = 0;
 if (!heroGeometry) return;
 if (mobileLayout.matches) {
  categoryImages.forEach(slot => slot.classList.remove('is-destination'));
  dockHero(heroAnchor);
  scrollProgress = 0;
  previousScrollY = window.scrollY;
  returningToTop = false;
  return;
 }
 const { source, targets, start } = heroGeometry;
 const target = targets[activeSlide];
 const finish = Math.max(start + source.height * .8, target.top - window.innerHeight * .55);
 if (window.scrollY < previousScrollY - 1 && scrollProgress > 0) returningToTop = true;
 if (window.scrollY <= 0) returningToTop = false;
 previousScrollY = window.scrollY;
 scrollProgress = Math.max(0, Math.min(1, (window.scrollY - start) / (finish - start)));
 const docked = returningToTop || scrollProgress === 1 || (reducedMotion.matches && window.scrollY >= start);
 categoryImages.forEach((slot, index) => slot.classList.toggle('is-destination', index === activeSlide && (scrollProgress > 0 || docked)));

 if (docked) {
  dockHero(categoryImages[activeSlide]);
 } else if (window.scrollY <= start || reducedMotion.matches) {
  dockHero(heroAnchor);
 } else {
  if (heroImage.parentElement !== document.body) document.body.appendChild(heroImage);
  heroImage.classList.add('is-travelling');
  heroImage.style.setProperty('--hero-emphasis', 1 - scrollProgress);
  heroImage.style.setProperty('--callout-opacity', Math.max(0, 1 - scrollProgress * 2));
  // Follow the page until halfway through the hero, then travel to the menu.
  const mix = (from, to) => from + (to - from) * scrollProgress;
  heroImage.style.transform = `translate3d(${mix(source.left, target.left)}px, ${mix(source.top, target.top) - window.scrollY}px, 0)`;
  heroImage.style.width = `${mix(source.width, target.width)}px`;
  heroImage.style.height = `${mix(source.height, target.height)}px`;
 }
}

function scheduleHero() {
 if (!animationFrame) animationFrame = requestAnimationFrame(renderHero);
}

function showHeroSlide(index) {
 activeSlide = index;
 heroSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === activeSlide));
 heroDots.forEach((dot, index) => dot.setAttribute('aria-pressed', String(index === activeSlide)));
 heroFoodName.textContent = heroCategoryNames[activeSlide];
 heroImage.setAttribute('aria-label', heroFoodNames[activeSlide]);
 scheduleHero();
}

let carouselTimer;
function startCarousel() {
 clearInterval(carouselTimer);
 carouselTimer = setInterval(() => {
  // Freeze the category once the user starts scrolling, until they return to the hero.
  if (scrollProgress > 0 || window.scrollY > 0 || document.hidden || reducedMotion.matches) return;
  showHeroSlide((activeSlide + 1) % heroSlides.length);
 }, HERO_SLIDE_INTERVAL);
}

heroDots.forEach((dot, index) => dot.addEventListener('click', () => {
 showHeroSlide(index);
 startCarousel();
}));
startCarousel();

const categoryNav = document.querySelector('.category-nav');
const categoryNavLinks = [...categoryNav.querySelectorAll('a')];
const menuOverview = document.querySelector('#menu');

function updateCategoryNav() {
 const visible = menuOverview.getBoundingClientRect().bottom <= 0;
 categoryNav.classList.toggle('is-visible', visible);
 categoryNav.inert = !visible;
 let currentSection = menuSections[0];
 menuSections.forEach(section => {
  if (section.getBoundingClientRect().top <= categoryNav.offsetHeight + 80) currentSection = section;
 });
 categoryNavLinks.forEach(link => {
  if (visible && link.hash === `#${currentSection.id}`) link.setAttribute('aria-current', 'location');
  else link.removeAttribute('aria-current');
 });
}

window.addEventListener('scroll', () => { scheduleHero(); updateCategoryNav(); }, { passive: true });
window.addEventListener('resize', measureHero);
window.addEventListener('resize', updateCategoryNav);
window.addEventListener('load', measureHero);
window.addEventListener('load', updateCategoryNav);
reducedMotion.addEventListener('change', scheduleHero);
new ResizeObserver(measureHero).observe(document.querySelector('#menu'));
document.fonts.ready.then(measureHero);
measureHero();
updateCategoryNav();
