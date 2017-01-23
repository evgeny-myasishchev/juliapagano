const path = require('path');

module.exports = {
  port: 3000,
  assets: {
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

  content: {
    siteTitle: 'Photographer in Fife'
  },

  logging: {
    name: 'juliapagano',
    stdout: {
      enabled: true,
      filterAssets: false,
      level: 'debug'
    },
    file: {
      enabled: false
    }
  },

  cache: {
    maxItems: 100,
    maxAgeMs: 30 * 60 * 1000 //30 minutes
  },

  EmailTemplate: {
    baseDir: path.join('app', 'views', 'mail')
  },

  contacts: {
    sendTo: process.env.CONTACTS_SEND_TO
  },

  emailProvider: {
    subjectPrefix: '[TEST]',
    mailgun: {
      baseUrl: 'https://api.mailgun.net/v3',
      user: 'api',
      domain: process.env.MAILGUN_MAIL_DOMAIN,
      key: process.env.MAILGUN_API_KEY
    }
  },

  swig: {
    cache: 'memory'
  },

  goggleAnalytics: {
    enabled: !!process.env.GA_TRACKING_ID,
    trackingId: process.env.GA_TRACKING_ID
  }
};
