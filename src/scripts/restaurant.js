import { getView } from '../data/view.js';
import { animateEntrance } from './motion.js';

let category = 1;
let location = 1;
let navOpen = false;
const root = document.querySelector('.a-root');
const navigation = root.querySelector('.mnav');
const header = root.querySelector('.nav');
let lastScrollY = Math.max(0, window.scrollY);
let scrollPending = false;

window.addEventListener('scroll', () => {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - lastScrollY;
    if (currentY <= 80 || navOpen) {
      header.classList.remove('nav-hidden');
      lastScrollY = currentY;
    } else if (Math.abs(delta) >= 8) {
      header.classList.toggle('nav-hidden', delta > 0);
      lastScrollY = currentY;
    }
    scrollPending = false;
  });
}, { passive: true });
// Keyboard navigation can always bring the header back into view.
header.addEventListener('focusin', () => header.classList.remove('nav-hidden'));
const items = root.querySelector('[data-menu-items]');
const read = (view, path) => path.split('.').reduce((value, key) => value[key], view);

function updateMenu(locationChanged = false) {
  const view = getView(category, location, navOpen);
  root.querySelectorAll('[data-text]').forEach((element) => {
    element.textContent = read(view, element.dataset.text);
  });
  root.querySelectorAll('*').forEach((element) => {
    for (const attribute of element.attributes) {
      if (attribute.name.startsWith('data-bind-')) {
        element.setAttribute(attribute.name.slice(10), attribute.value.replace(/\[([\w.]+)\]/g, (_, path) => read(view, path)));
      }
    }
  });
  items.replaceChildren(...view.items.map((item) => {
    const li = document.createElement('li');
    li.className = 'item';
    const name = document.createElement('h4');
    name.textContent = item.n;
    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = item.p;
    const description = document.createElement('p');
    description.textContent = item.e;
    li.append(name, price, description);
    return li;
  }));
  animateEntrance(root.querySelector('.feat-body'));
  animateEntrance(items, 45);
  if (locationChanged) animateEntrance(root.querySelector('.loc-info'));
}

function setNavigation(open) {
  navOpen = open;
  if (open) header.classList.remove('nav-hidden');
  navigation.hidden = !open;
  root.querySelector('.burger').setAttribute('aria-expanded', String(open));
}

root.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'openNav' || action === 'closeNav') {
    setNavigation(action === 'openNav');
  } else if (/^pickL[12]$/.test(action)) {
    if (location === Number(action.slice(-1))) return;
    location = Number(action.slice(-1));
    updateMenu(true);
  } else if (/^pick[1-6]$/.test(action)) {
    if (category === Number(action.slice(-1))) return;
    category = Number(action.slice(-1));
    updateMenu();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navOpen) {
    setNavigation(false);
    root.querySelector('.burger').focus();
  }
});
