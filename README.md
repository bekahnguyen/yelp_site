#
An app designed for Paso and it's many many wineries using React, Javascript, PSQL, Node, and Express.


# Setup

- create database

```
createdb acme_talent_agency_db
```

- install dependencies

```
npm install && cd client && npm install
```

- start server in root directory of repository
```
npm run start:dev
```

- start vite server in client directory

```
npm run dev
```

- to test deployment
```
cd client && npm run build
```

browse to localhost:3000 (or whatever server port you used)

- build script for deploy

```
npm install && cd client && npm run build
```
- start script for deploy 

```
node server/index.js



