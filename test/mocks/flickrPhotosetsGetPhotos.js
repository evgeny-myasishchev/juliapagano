const timestamp = new Date().getTime();

module.exports = {
  photoset: {
    id: `photoset-id-${timestamp}`,
    primary: `primary-${timestamp}`,
    owner: `owner-${timestamp}`,
    ownername: `owner-name-${timestamp}`,
    photo: [
      {
        id: (timestamp + 100).toString(),
        secret: `secret-100-${timestamp}`,
        server: `server-100${timestamp}`,
        farm: timestamp,
        title: `Title 100 ${timestamp}`,
      },
      {
        id: (timestamp + 110).toString(),
        secret: `secret-110-${timestamp}`,
        server: `server-110${timestamp}`,
        farm: timestamp,
        title: `Title 110 ${timestamp}`,
      },
      {
        id: (timestamp + 120).toString(),
        secret: `secret-120-${timestamp}`,
        server: `server-120${timestamp}`,
        farm: timestamp,
        title: `Title 120 ${timestamp}`,
      },
    ],
    page: 1,
    per_page: 500, // jshint ignore:line
    perpage: 500,
    pages: 1,
    total: '3',
    title: `Gallery name ${timestamp}`,
  },
  stat: 'ok',
};
