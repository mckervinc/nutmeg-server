# Nutmeg Server
![](https://i.imgur.com/dCCIB3a.png)

Work in progress.

This is the server code for Nutmeg and there are a couple steps to get started developing so bear with me.

## Environment
We use dotenv to manage the environment in local environments. This means you must have a .env file. Ask andrew for it.

## Local DB
We use vagrant to manage a local version of the database. I've provided the Vagrantfile in the `vagrant` folder. To run, just enter the command `vagrant up` in the vagrant folder.

## Migrations
We use [Knex](http://knexjs.org/) to manage migrations, DB connections etc. To run migrations, you need to ask Andrew for two things, the migrations folder (which I might just add to the repo if it gets too complicated) and the `knexfile.js`. 

Once you have those you need to run
```
npm i -g knex
```
To run a migration you can run
```
knex migrate:latest --env development // or staging or production
```
To make a new migration just run
```
knex migrate:make
```
For more help you can always run 
```
knex -h
```

## Developing
Woo! Now you've gotten setup (don't forget to `npm i` and you can start developing. To start in development mode you can run
```
npm run dev
```
which triggers `nodemon` to keep watching for file changes.

To test:
```
npm test
```
Unit tests are stored in the tests folder and we use `jest`

To lint:
```
npm lint
```
should do the trick. We use tslint to manage style + cut down on errors. To automatically fix linting errors you can use
```
npm lint-fix
```

And finally! before you deploy make sure you test a prod like build with
```
npm start
```