const config = require('config');
const LRU = require('lru-cache');

const moduleCfg = config.get('cache');

const cache = LRU({
  max: moduleCfg.max,
  maxAge: moduleCfg.maxAgeMs,
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
  set,
  get,
  reset,
  has,
};
