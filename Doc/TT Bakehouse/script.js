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
const menuItems = [
 ...rolls.map(([name, price, description]) => ({ category: 'rolls', folder: 'Rolls', name, label: name, price, description })),
 ...savoury.map(([name, price]) => ({ category: 'savoury', folder: 'Savoury', name, label: name, price, description: '' })),
 ...sweet.map(([name, label]) => ({ category: 'sweet', folder: 'Sweet', name, label: label || name, price: '', description: '' }))
];
const menuGrid = document.querySelector('#menu-grid');
menuGrid.innerHTML = menuItems.map(({ category, folder, name, label, price, description }) => `
 <article class="menu-card" data-category="${category}" data-search="${`${label} ${description}`.toLowerCase()}">
  <div class="menu-card-image"><img src="${folder}/${name}.svg" alt="" loading="lazy"></div>
  <h3>${label}</h3>
  ${price ? `<strong class="menu-card-price">${price}</strong>` : ''}
 </article>`).join('');
const searchForm = document.querySelector('.header-search');
const searchInput = document.querySelector('#menu-search');
const searchButton = searchForm.querySelector('button');
const mobileLayout = window.matchMedia('(max-width: 750px)');
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.mobile-menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
const menuNav = document.querySelector('.menu-nav');
const menuTrigger = document.querySelector('.menu-trigger');
const hoverMenu = window.matchMedia('(hover: hover) and (pointer: fine)');

function setFiltersOpen(open) {
 menuNav.classList.toggle('is-open', open);
 menuTrigger.setAttribute('aria-expanded', String(open));
}
menuTrigger.addEventListener('click', () => setFiltersOpen(!menuNav.classList.contains('is-open')));
menuNav.addEventListener('pointerenter', () => {
 if (hoverMenu.matches && !mobileLayout.matches) setFiltersOpen(true);
});
menuNav.addEventListener('pointerleave', () => {
 if (hoverMenu.matches && !mobileLayout.matches) setFiltersOpen(false);
});
new IntersectionObserver(([entry]) => {
 header.classList.toggle('menu-in-view', entry.isIntersecting);
}, { rootMargin: '-72px 0px -50% 0px' }).observe(document.querySelector('#menu'));

function setMenuOpen(open) {
 header.classList.toggle('menu-open', open);
 menuToggle.setAttribute('aria-expanded', String(open));
 menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
 if (!open) setFiltersOpen(false);
}
menuToggle.addEventListener('click', () => {
 const open = !header.classList.contains('menu-open');
 setMenuOpen(open);
 if (open) setFiltersOpen(true);
});
primaryNav.addEventListener('click', event => {
 if (event.target.closest('a')) {
  const categoryLink = event.target.closest('.menu-dropdown a');
  if (categoryLink) {
   setCategory(categoryLink.dataset.category);
   setSearchOpen(false);
  }
  setFiltersOpen(false);
  setMenuOpen(false);
 }
});
document.addEventListener('click', event => {
 if (header.classList.contains('menu-open') && !header.contains(event.target)) setMenuOpen(false);
 if (menuNav.classList.contains('is-open') && !menuNav.contains(event.target)) setFiltersOpen(false);
});
document.addEventListener('keydown', event => {
 if (event.key === 'Escape') {
  if (header.classList.contains('menu-open')) {
   setMenuOpen(false);
   menuToggle.focus();
  } else if (menuNav.classList.contains('is-open')) {
   setFiltersOpen(false);
   menuTrigger.focus();
  }
 }
});
mobileLayout.addEventListener('change', () => { setMenuOpen(false); setFiltersOpen(false); });

function setSearchOpen(open) {
 if (open) { setMenuOpen(false); setFiltersOpen(false); }
 searchForm.classList.toggle('is-open', open);
 searchButton.setAttribute('aria-expanded', String(open));
 searchButton.setAttribute('aria-label', open ? 'Search' : 'Open search');
 if (open) searchInput.focus();
}
searchForm.addEventListener('keydown', event => {
 if (event.key === 'Escape') {
  setSearchOpen(false);
  searchButton.focus();
 }
});
function updateSearchLayout() {
 searchButton.setAttribute('aria-controls', 'menu-search');
 searchButton.setAttribute('aria-expanded', String(searchForm.classList.contains('is-open')));
 searchButton.setAttribute('aria-label', searchForm.classList.contains('is-open') ? 'Search' : 'Open search');
}
mobileLayout.addEventListener('change', updateSearchLayout);
updateSearchLayout();
document.addEventListener('click', event => {
 if (searchForm.classList.contains('is-open') && !searchForm.contains(event.target)) setSearchOpen(false);
});
const searchStatus = document.querySelector('#search-status');
const menuCards = [...menuGrid.querySelectorAll('.menu-card')];
const categoryButtons = [...document.querySelectorAll('.menu-filters button')];
const normalizeSearch = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
let activeCategory = 'all';

function setCategory(category, clearSearch = true) {
 activeCategory = category;
 if (clearSearch) searchInput.value = '';
 categoryButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
 filterMenu();
}
document.querySelector('.menu-filters').addEventListener('click', event => {
 const button = event.target.closest('button[data-category]');
 if (button) setCategory(button.dataset.category);
});

function filterMenu() {
 const query = searchInput.value.trim();
 const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
 let total = 0;
 menuCards.forEach(card => {
  const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
  const text = normalizeSearch(`${card.dataset.category} ${card.dataset.search}`);
  const matches = matchesCategory && terms.every(term => text.includes(term));
  card.hidden = !matches;
  if (matches) total++;
 });
 searchStatus.hidden = !query;
 searchStatus.textContent = query
  ? (total ? `${total} menu item${total === 1 ? '' : 's'} found for “${query}”.` : `No menu items found for “${query}”. Try another search.`)
  : '';
}

searchInput.addEventListener('input', () => setCategory('all', false));
searchForm.addEventListener('submit', event => {
 event.preventDefault();
 if (!searchForm.classList.contains('is-open')) {
  setSearchOpen(true);
  return;
 }
 filterMenu();
 const target = document.querySelector('#menu');
 target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});
