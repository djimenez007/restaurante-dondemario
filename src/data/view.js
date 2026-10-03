import { menu, locations } from './restaurant.json';

export function getView(category, location, navOpen = false) {
  const cat = menu[category - 1];
  const key = location === 1 ? 'L1' : 'L2';
  return {
    items: cat[key], L: locations[key],
    catTitle: cat.t, catImg: cat.img, catAlt: cat.alt, catCount: cat[key].length,
    l1: location === 1, l2: location === 2, navOpen,
    ...Object.fromEntries(menu.map((_, index) => ['c' + (index + 1), category === index + 1])),
  };
}
