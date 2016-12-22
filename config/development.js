module.exports = {
  logging: {
    stdout: {
      filterAssets: true,
    },
    file: {
      enabled: true,
      path: 'log/development.log',
    },
  },

  mongo: {
    url: 'mongodb://localhost/juliapagano-dev',
  },

  swig: {
    cache: false,
  },
};
