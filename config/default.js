module.exports = {
  assets: {
    compile: true,
    paths: [
      'app/assets/css',
      'app/assets/js',
      'vendor/assets'
    ],
    buildDir: 'public/assets'
  },

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
