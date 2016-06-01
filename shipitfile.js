'use strict';
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  shipit.initConfig({
    default: {
      workspace: '.',
      repositoryUrl: 'https://github.com/evgeny-myasishchev/juliapagano',
      ignores: ['.git', 'node_modules', 'log/*', 'public/assets/*', 'spec', 'tmp/*'],
      keepReleases: 3,
    },
    production: {
      servers: 'juliapagano@hbox',
      deployTo: '/apps/juliapagano',
    },
  });

  shipit.task('remote:restart', function () {
    return shipit.remote('touch current/tmp/restart.txt');
  });

  shipit.task('remote:install-deps', function () {
    return shipit.remote('source .shipit-profile && cd current && npm install');
  });

  shipit.task('remote:migrate', function () {
    return shipit.remote('source .shipit-profile && cd current && bin/knex migrate:latest');
  });

  shipit.task('remote:seed', function () {
    return shipit.remote('source .shipit-profile && cd current && bin/knex seed:run');
  });

  shipit.on('published', function () {
    shipit.start('remote:install-deps');
    shipit.remote('touch current/tmp/restart.txt');
  });
};
