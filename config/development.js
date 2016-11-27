module.exports = {
  logging: {
    stdout: {
      filterAssets: true
    },
    file: {
      enabled: true,
      path: 'log/development.log'
    }
  },

  swig: {
    cache: false
  }
};
