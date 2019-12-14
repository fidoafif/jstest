# app

> for test javascript programmer

## Build Setup

```bash

# install server
$ cd core-service
$ yarn
$ yarn start

# unit testing
$ yarn e2e

# migration
$ yarn migration:generate InitDB && yarn barrelsby --delete -d ./src/migrations

# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
