module.exports = {
  flickrClient: {
    apiKey: process.env.FLICKR_API_KEY,
    userId: process.env.FLICKR_USER_ID
  },

  logging: {
    name: 'juliapagano',
    stdout: {
      enabled: true,
      level: 'debug'
    },
    file: {
      enabled: false
    }
  }
};
