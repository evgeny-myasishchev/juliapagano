const prices = require('../data/prices');

module.exports = {
  home: {
    name: 'Home',
    path: '/',
    carousel: { photosetId: '72157669540784146' },
  },
  about: {
    name: 'About',
    path: '/about',
    selfie: { photosetId: '72157669781414392' },
  },
  portfolio: {
    name: 'Portfolio',
    path: '/portfolio',
    gallery: { photosetId: '72157667031701733' },
  },
  'kind-words': {
    name: 'Kind Words',
    path: '/kind-words',
  },
  'info-and-prices': {
    name: 'Info and Prices',
    path: '/info-and-prices',
    prices,
  },
  'special-offers': {
    name: 'Special Offers',
    path: '/special-offers',
    photosetId: '72157673194132624',
  },
  blog: {
    name: 'Blog',
    path: 'http://juliapagano.blogspot.co.uk/',
    external: true,
    externalHint: 'This opens my blog which is a different site.',
  },
  contacts: { name: 'Contacts', path: '/contacts' },
};
