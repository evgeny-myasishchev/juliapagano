# juliapagano

[![Build][travis-image]][travis-url]

Personal website of photographer Julia Pagano

# Docker

## Build image

docker build -t juliapagano .

## Run image

Prepare file with env:
NODE_ENV=production|staging
FLICKR_API_KEY=TODO
FLICKR_USER_ID=TODO
MAILGUN_API_KEY=TODO
MAILGUN_MAIL_DOMAIN=TODO
CONTACTS_SEND_TO=Email to send contacts form messages

Create and start docker container
docker run -d --env-file [path-to-env-file] -p 8080:3000 --name juliapagano-prod evgenymyasishchev/juliapagano

Additionally restart policy like ```--restart=unless-stopped``` may need to be added.

## License

  [MIT](LICENSE)

[travis-image]: https://travis-ci.org/evgeny-myasishchev/juliapagano.svg?branch=master
[travis-url]: https://travis-ci.org/evgeny-myasishchev/juliapagano
