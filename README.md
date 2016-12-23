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

# Production containers

## Mongo

**Create network first**

```docker network create juliapagano-prod```

### Create container

```docker run --net juliapagano-prod --name mongo-prod -d mongo:3.4 --auth```

Additionally restart policy like ```--restart=unless-stopped``` may need to be added.

### Setup auth

```docker exec -it mongo-prod mongo admin```

** Admin user **

```
$ db.createUser({ user: 'admin', pwd: 'password', roles: [ "userAdminAnyDatabase" } ] });
$ db.auth('admin', 'password');
```

** App user **

```
$ use juliapagano;
$ db.createUser({ user: 'juliapagano-app', pwd: 'password', roles: [ "dbOwner" ] });
```

**Note:** Use custom login/password for users above


## Web app

### Build image

(or pull most recent from docker hub)

```docker build -t evgenymyasishchev/juliapagano .```

### Run container

Prepare file with env:
```
NODE_ENV=production|staging
FLICKR_API_KEY=TODO
FLICKR_USER_ID=TODO
MAILGUN_API_KEY=TODO
MAILGUN_MAIL_DOMAIN=TODO
CONTACTS_SEND_TO=Email to send contacts form messages
MONGO_URL=mongodb://juliapagano-app:password@mongo-prod/juliapagano
```

Load initial data

```docker run --rm --net juliapagano-prod --env-file env.production -it evgenymyasishchev/juliapagano bin/initial-data load```

Create and start docker container

```docker run --net juliapagano-prod -d --env-file app.env -p 8080:3000 --name juliapagano-prod evgenymyasishchev/juliapagano```

Note: Feel free to use custom port instead of 8080

Additionally restart policy like ```--restart=unless-stopped``` may need to be added.

## License

  [MIT](LICENSE)

[travis-image]: https://travis-ci.org/evgeny-myasishchev/juliapagano.svg?branch=master
[travis-url]: https://travis-ci.org/evgeny-myasishchev/juliapagano
