'use strict';
module.exports = function (shipit) {
  shipit.initConfig({
    default: {
      workspace: './juliapagano',
      servers: process.env.USER + '@hbox',
      dockerRepository: 'evgenymyasishchev/juliapagano'
    },
    production: {
      container: 'juliapagano-prod',
      port: 6000
    },
    staging: {
      container: 'juliapagano-stage',
      port: 6010
    }
  });

  // Perform new deployment
  shipit.task('deploy:cold', function () {
    const envFile = this.config.workspace + '/.env';
    const port = this.config.port;
    const repo = this.config.dockerRepository;
    const container = this.config.container;
    return shipit.remote('docker pull ' + this.config.dockerRepository)
      .then(() => shipit.remote([
        'docker run -d',
        '--env-file', envFile,
        '-p ' + port + ':3000',
        '--name ', container, repo
      ].join(' ')));
  });

  // Perform update
  shipit.task('deploy', function () {
    const envFile = this.config.workspace + '/.env';
    const port = this.config.port;
    const repo = this.config.dockerRepository;
    const container = this.config.container;
    return shipit.remote('docker pull ' + this.config.dockerRepository)
      .then(() => shipit.remote([
        'docker stop', container
      ].join(' ')))
      .then(() => shipit.remote([
        'docker rm', container
      ].join(' ')))
      .then(() => shipit.remote([
        'docker run -d',
        '--env-file', envFile,
        '-p ' + port + ':3000',
        '--name ', container, repo
      ].join(' ')));
  });

  shipit.task('deploy:restart', function () {
    return shipit.remote('docker restart ' + this.config.container);
  });
};
