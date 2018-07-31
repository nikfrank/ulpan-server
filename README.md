# ulpan project (server)

make your own lessons

get diagnostics

hebrew language shouldn't be a prison!


---

Agenda:

- Section 0: concepts and introduction
  - Server architecture
    - API design
    - Testing our API with POSTMAN
    - Database schema design
  - statelessness and crashability
    - in memory solutions
    - databases on the cloud

- Section 1: Using ExpressJS to expose an API
  - hello world
  - make a router, respond with fake data
  - test a GET route in the browser
  - download POSTMAN, use it to test a POST route
- Section 2: Using Postgres with an ORM

- Section 3: Identity middleware


- Section 2: Server for saving exercises and results
  - step0: booting an express server
  - step1: defining API routes and their handlers
    - responding with stub data
  - step2: connecting to postgres (involves installation of postgres)
    - hydrating tables with mock data
    - reading data from the db for GET requests
    - saving data from POST requests
    - updating data with PUT or PATCH requests


---


## Section 0: ...



---


## installation

```
$ cd ~/code
$ git clone https://github.com/nikfrank/ulpan-server
$ cd ulpan-server
$ git checkout step0
```


## Section 1: Using ExpressJS to expose an API

```$ git checkout step0```

we're starting with nothing more than a package.json and an empty index.js file


### hello world

let's install ```express```, the standard web server framework for node, along with some standard utility packages


```$ yarn add express body-parser morgan```

taking a look at the [getting started section](https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize) we can start out in ./index.js


(this course I've linked to is quite similar to ours - scotch.io is focusing on using express for postgres, where my focus is using express as a swiss army knife...)


./index.js
```js
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Respond to requests to the base route in JSON
app.get('/', (req, res) => {
  res.json({
    message: 'hello world',
  });
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));
```

and let's make a convenience ```npm start``` script in our package.json

./package.json
```js
//...
  "scripts": {
    "start": "node .",
    //...
  },
//...
```

so now we can run

```$ npm start```

and see [http://localhost:4000](http://localhost:4000) in our browser printing Dennis Ritchie's famous words.

now that we have the most basic possible server running, let's start building our API


### make a router, respond with fake data

```$ touch ./routes.js```

./src/index.js
```js
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Respond to requests to the base route in JSON
app.use('/', routes);

app.listen(4000, () => console.log('Example app listening on port 4000!'));
```

now our index file will load API routes from a routes file, so index never has to change again


./routes.js
```js
const express = require('express');
const routes = express.Router();

routes.get('/', (req, res)=> res.json({ test: 'router' }) );

module.exports = routes;
```

we have separated our routeHandlers into their own file, to separate our concerns.

Now we can start responding to real requests with real fake data, and our front end can try connecting to our server.



our first API routes we wish to respond to are

| path | method | request body | response |
|:---|:---|:---|:---|
| /execise | GET | none | [ { exerciseJSON },.. ] |
| /result | POST | { resultJSON } | successMessage |


[express' documentation](https://expressjs.com/en/guide/routing.html) shows us the pattern we need will be

./routes.js
```js
//...

routes.get('/exercise', (req, res)=> {
  // return some exercises
});

routes.post('/result', (req, res)=> {
  // pretend to save the result, respond with a successMessage
});

module.exports = routes;
```


let's grab the example exercises from [the front end](https://github.com/nikfrank/react-ulpan/blob/step2/src/App.js)


./routes.js
```js
const express = require('express');
const routes = express.Router();


const fakeExercises = [
  {
    prompt: 'עישון שווה לעבדות',
    answer: //...

  //...

  }
];
```


and respond with them in the GET request

```js
//...

routes.get('/exercise', (req, res)=> {
  res.json( fakeExercises );
});

//...
```

we can test this in the browser by navigating (aka doing a get request) to [localhost:4000/exercise](http://localhost:4000/exercise)



for the POST request for creating a result, let's log out the request body and pretend to succeed

```js
routes.post('/result', (req, res)=> {
  console.log( req.body );
  
  res.status(201).json({ createdId: '1308f183nf' });
});
```

to test this we'll need to install POSTMAN