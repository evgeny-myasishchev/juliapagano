'use strict';

function stopContainer(shipit) {
  return shipit.remote('docker stop ' + shipit.config.container);
}

function startContainer(shipit) {
  return shipit.remote('docker start ' + shipit.config.container);
}

function containerRestart(shipit) {
  return stopContainer(shipit).then(() => startContainer(shipit));
}

function createContainer(shipit) {
  const envFile = shipit.config.workspace + '/app.env';
  const port = shipit.config.port;
  const repo = shipit.config.dockerRepository;
  const container = shipit.config.container;
  return shipit.remote([
    'docker run -d --restart=unless-stopped',
    '--env-file', envFile,
    '-p ' + port + ':3000',
    '--name ', container, repo
  ].join(' '));
}

module.exports = function (shipit) {
  shipit.initConfig({
    default: {
      servers: process.env.DEPLOY_SERVER || (process.env.USER + '@hbox'),
      dockerRepository: 'evgenymyasishchev/juliapagano'
    },
    production: {
      workspace: './juliapagano/prod',
      container: 'juliapagano-prod',
      port: 6000
    },
    staging: {
      workspace: './juliapagano/stage',
      container: 'juliapagano-stage',
      port: 6010
    }
  });

  // Perform new deployment
  shipit.task('deploy:cold', function () {
    return createContainer(shipit);
  });

  // Perform update
  shipit.task('deploy', function () {
    return shipit.remote('docker pull ' + this.config.dockerRepository)
      .then(() => stopContainer(shipit))
      .then(() => shipit.remote(['docker rm', shipit.config.container].join(' ')))
      .then(() => createContainer(shipit));
  });

  shipit.task('deploy:create-container', function () {
    return createContainer(shipit);
  });

  shipit.task('deploy:container-stop', () => stopContainer(shipit));

  shipit.task('deploy:container-start', () => startContainer(shipit));

  shipit.task('deploy:container-restart', function () {
    return containerRestart(shipit);
  });
};
