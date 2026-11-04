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
const searchButton = searchForm.querySelector('button');
const mobileLayout = window.matchMedia('(max-width: 750px)');
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.mobile-menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

function setMenuOpen(open) {
 header.classList.toggle('menu-open', open);
 menuToggle.setAttribute('aria-expanded', String(open));
 menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuToggle.addEventListener('click', () => setMenuOpen(!header.classList.contains('menu-open')));
primaryNav.addEventListener('click', event => {
 if (event.target.closest('a')) setMenuOpen(false);
});
document.addEventListener('click', event => {
 if (header.classList.contains('menu-open') && !header.contains(event.target)) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
 if (event.key === 'Escape' && header.classList.contains('menu-open')) {
  setMenuOpen(false);
  menuToggle.focus();
 }
});
mobileLayout.addEventListener('change', () => setMenuOpen(false));

function setSearchOpen(open) {
 if (open) setMenuOpen(false);
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
 if (!searchForm.classList.contains('is-open')) {
  setSearchOpen(true);
  return;
 }
 filterMenu();
 const target = searchInput.value.trim() ? searchStatus : document.querySelector(mobileLayout.matches ? '#rolls' : '#menu');
 target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});
