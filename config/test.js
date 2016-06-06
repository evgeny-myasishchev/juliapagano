module.exports = {
  flickrClient: {
    apiKey: 'dummy-api-key-' + new Date().getTime(),
    userId: 'dummy-user-id-' + new Date().getTime()
  },

  logging: {
    stdout: {
      enabled: false
    },
    file: {
      enabled: true,
      path: 'log/test.log'
    }
  }
};
