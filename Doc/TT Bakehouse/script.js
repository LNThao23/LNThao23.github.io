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
const menuDropdownToggle = document.querySelector('.menu-dropdown-toggle');
const hoverMenu = window.matchMedia('(hover: hover) and (pointer: fine)');

function setFiltersOpen(open) {
 menuNav.classList.toggle('is-open', open);
 menuDropdownToggle.setAttribute('aria-expanded', String(open));
 menuDropdownToggle.setAttribute('aria-label', open ? 'Close menu filters' : 'Open menu filters');
}
menuDropdownToggle.addEventListener('click', () => setFiltersOpen(!menuNav.classList.contains('is-open')));
menuNav.addEventListener('pointerenter', () => {
 if (hoverMenu.matches && !mobileLayout.matches) setFiltersOpen(true);
});
menuNav.addEventListener('pointerleave', () => {
 if (hoverMenu.matches && !mobileLayout.matches) setFiltersOpen(false);
});
const sectionLinks = [...primaryNav.querySelectorAll('a[href="#about"], a[href="#contact"]')];
const trackedSections = ['menu', 'about', 'contact'].map(id => document.getElementById(id));
function updateActiveNav() {
 const probe = window.innerHeight * .45;
 const current = trackedSections.find(section => {
  const bounds = section.getBoundingClientRect();
  return bounds.top <= probe && bounds.bottom > probe;
});
 header.classList.toggle('menu-in-view', current?.id === 'menu');
 sectionLinks.forEach(link => {
  const active = link.hash === `#${current?.id}`;
  link.classList.toggle('is-current', active);
  if (active) link.setAttribute('aria-current', 'location');
  else link.removeAttribute('aria-current');
 });
}
let navUpdateQueued = false;
function queueActiveNavUpdate() {
 if (navUpdateQueued) return;
 navUpdateQueued = true;
 requestAnimationFrame(() => { navUpdateQueued = false; updateActiveNav(); });
}
window.addEventListener('scroll', queueActiveNavUpdate, { passive: true });
window.addEventListener('resize', queueActiveNavUpdate);
updateActiveNav();

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
   menuDropdownToggle.focus();
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
const menuPagination = document.querySelector('#menu-pagination');
const categoryButtons = [...document.querySelectorAll('.menu-filters button')];
const normalizeSearch = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
let activeCategory = 'all';
let activePage = 1;
const itemsPerPage = 6;

function setCategory(category, clearSearch = true) {
 activeCategory = category;
 activePage = 1;
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
 const matchingCards = menuCards.filter(card => {
  const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
  const text = normalizeSearch(`${card.dataset.category} ${card.dataset.search}`);
  return matchesCategory && terms.every(term => text.includes(term));
 });
 const total = matchingCards.length;
 const pageCount = Math.ceil(total / itemsPerPage);
 activePage = Math.min(activePage, Math.max(1, pageCount));
 const visibleCards = new Set(matchingCards.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage));
 menuCards.forEach(card => { card.hidden = !visibleCards.has(card); });
 menuPagination.hidden = pageCount <= 1;
 menuPagination.innerHTML = pageCount <= 1 ? '' : `
  <button type="button" data-page="${activePage - 1}" aria-label="Previous page" ${activePage === 1 ? 'disabled' : ''}>&larr;</button>
  ${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" aria-label="Page ${index + 1}" ${activePage === index + 1 ? 'aria-current="page"' : ''}>${index + 1}</button>`).join('')}
  <button type="button" data-page="${activePage + 1}" aria-label="Next page" ${activePage === pageCount ? 'disabled' : ''}>&rarr;</button>`;
 searchStatus.hidden = !query;
 searchStatus.textContent = query
  ? (total ? `${total} menu item${total === 1 ? '' : 's'} found for “${query}”.` : `No menu items found for “${query}”. Try another search.`)
  : '';
}

menuPagination.addEventListener('click', event => {
 const button = event.target.closest('button[data-page]');
 if (!button || button.disabled) return;
 activePage = Number(button.dataset.page);
 filterMenu();
 document.querySelector('#menu').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});

filterMenu();

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
