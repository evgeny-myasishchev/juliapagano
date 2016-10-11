'use strict';

const config = require('config').get('cache');
const LRU = require('lru-cache');
const cache = LRU({
    max: config.max,
    maxAge: config.maxAge
  });

function set(key, value, maxAge) {
  return cache.set(key, value, maxAge);
}

function get(key) {
  return cache.get(key);
}

function reset() {
  return cache.reset();
}

function has(key) {
  return cache.has(key);
}

module.exports = {
    set: set,
    get: get,
    reset: reset,
    has: has
  };
