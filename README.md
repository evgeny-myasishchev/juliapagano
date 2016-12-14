# juliapagano

[![Build][travis-image]][travis-url]

Personal website of photographer Julia Pagano

# Development

Mongo is used as a storage engine so it has to be running on dev workstation.
Simplest way is to use docker:

```docker run --name mongo-dev -d -p 27017:27017 mongo:3.4```

And mongoclient

```docker run -d -p 3500:3000 --name mongoclient mongoclient/mongoclient```

Then you have to load initial content of the site

```bin/initial-data load | bunyan```

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

```docker run -d --env-file [path-to-env-file] -p 8080:3000 --name juliapagano-prod evgenymyasishchev/juliapagano```

Additionally restart policy like ```--restart=unless-stopped``` may need to be added.

## License

  [MIT](LICENSE)

[travis-image]: https://travis-ci.org/evgeny-myasishchev/juliapagano.svg?branch=master
[travis-url]: https://travis-ci.org/evgeny-myasishchev/juliapagano
