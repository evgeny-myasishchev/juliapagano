/* eslint-disable max-len */

const about = require('./initial-data/about');
const home = require('./initial-data/home');
const infoAndPrices = require('./initial-data/info-and-prices');
const kindWords = require('./initial-data/kind-words');
const portfolio = require('./initial-data/portfolio');
const specialOffers = require('./initial-data/special-offers');

module.exports = {
  pages: [
    about, home, infoAndPrices, kindWords, portfolio, specialOffers,
  ],
};
