# juliapagano

[![Build][travis-image]][travis-url]

Personal website of photographer Julia Pagano

# Docker

## Build image

docker build -t juliapagano .

## Run image

Prepare file with env:
FLICKR_API_KEY=TODO
FLICKR_USER_ID=TODO

Create and start docker container
docker run -d --env-file [path-to-env-file] -p 8080:3000 --name juliapagano-prod evgenymyasishchev/juliapagano

Additionally restart policy like ```--restart=unless-stopped``` may need to be added.

## License

  [MIT](LICENSE)

[travis-image]: https://travis-ci.org/evgeny-myasishchev/juliapagano.svg?branch=master
[travis-url]: https://travis-ci.org/evgeny-myasishchev/juliapagano
