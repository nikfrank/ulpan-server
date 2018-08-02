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
  - step0: boot server and set up route handlers
    - hello world
    - make a router, respond with fake data
    - test a GET route in the browser
    - download POSTMAN, use it to test a POST route
  - step1: fake database using "in memory store", basic queries
    - reorganize directories
    - route application functions
    - routeHandler boilerplate
    - READ ALL exercise
    - CREATE exercise
    - QUERY exercise
    - READ ALL result
    - CREATE result
    - QUERY result
  - step2: filling out our API's query language, update route

- Section 2: Using Postgres with an ORM
  - step#: replace all fake APIs with real APIs
    - hydrating tables with mock data
    - reading data from the db for GET requests
    - saving data from POST requests
    - updating data with PUT or PATCH requests
  
- Section 3: Identity middleware

- Section 4: Deployment to heroku (along with front end)

- Section 5: Full coverage testing

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

to test this we'll need to install [POSTMAN](https://www.getpostman.com/docs/v6/postman/launching_postman/installation_and_updates)


lastly, to use this from our frontend - we'll need to apply a [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) [middleware](https://expressjs.com/en/resources/middleware/cors.html), as our server is on 'localhost:4000' and our app runs on 'localhost:3000'

```$ yarn add cors```

./index.js
```js
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

// Set up the express app
const app = express();

// Allow CORS
app.use(cors());

//...
```



---


### step1: fake database using "in memory store"

In order to build a better conceptual understanding of API services, before we use a real database to save edit and read our persisted entities, we'll build a fake one "in memory"


##### what does "in memory" mean?


instead of saving entities to a database where they will be available for multiple servers, even if those servers crash (which they will) - we will simply store them in JSON objects / arrays which we define as variables (ie that data will only exist in the runtime memory of the server)

the benefit of this is that it is super easy and clear what is going on

it is however, entirely unusable as a real server, as we will lose data all the time.

In many industry applications, the "facade" pattern is used as an interim solution while cloud infrastructure is acquired or server logic is implemented.




#### organize our directories

let's organize routes for each of our entities (results, exercises)

(many servers are organized differently than this, its important though that we have **some** organization scheme)

```
$ mkdir ./routes
$ mv routes.js ./routes/index.js
$ touch ./routes/exercise.js
$ touch ./routes/result.js
$ mkdir ./mocks
$ touch ./mocks/exercise.js
```

our routes index will now make a router and apply the entity specific routes

./routes/index.js
```js
const express = require('express');
const routes = express.Router();

const applyExerciseRoutes = require('./routes/exercise');
const applyResultRoutes = require('./routes/result');

applyExerciseRoutes( routes );
applyResultRoutes( routes );

module.exports = routes;
```


#### route application functions


what we'll do in each file of entity specific routes is:
- export a function which accepts the router as a param
- instantiate an in memory store inside the function
- apply each route to the router

the purpose of this is just to keep our logic separate for each entity

often, the work done on an api server has more to do with organization than complex logic.


./routes/exercise.js
```js
const mockExercises = require('../mocks/exercise');

module.exports = routes=> {

  // make a copy of the mock to "hydrate" the in memory store
  let inMem = JSON.parse( JSON.stringify( mockExercises ) );

  //... here we'll apply the routes
}
```

I've moved the exercise mock we had in ./routes.js to our new ```/mocks``` directory


#### routeHandler boilerplate


now we can set up the boilerplate for our routes

./routes/exercise.js
```js
const mockExercises = require('../mocks/exercise');

module.exports = routes=> {

  let inMem = JSON.parse( JSON.stringify( mockExercises ) );
  
  routes.get('/exercise', (req, res)=> {
    // here we'll return the exercises in the in memory store
  });

  routes.post('/exercise', (req, res)=> {
    // here we'll save the value from req.body into our in memory store
  });

  routes.post('/exercise/query', (req, res)=> {
    // here we'll filter inMem based on the query from req.body
  });
};
```

similarly in ./routes/result.js (just copy paste, find & replace: exercise -> result)


we'll of course at this point want some fake results as well

./mocks/result.js
```js
export default [
  {
    id: '0',
    score: 1,
    prompt:'עישון שווה לעבדות',
    guess: 'smoking is slavery',
  }, {
    id: '1',
    score: 1,
    prompt: 'מסים לא שונים לגניבה ',
    guess: 'tax is theft',
  }, {
    id: '2',
    score: 1,
    prompt: 'לא אפשר לחנות בתל אביב',
    guess: 'there\'s no parking in Tel Aviv',
  },
];
```

we may as well pretend like we got everything right!


In the same fashion, I've also added a unique ```id``` field on each item in ./mocks/exercise.js

---

at this point I've also deleted ```./routes.js``` in favour of the new ```./routes/index.js```

the way commonJS ```require``` naming conventions work means we don't have to change anything in ```./index.js```!

---

#### READ ALL exercises

firstly, our READ ALL route will be pretty easy... just respond with the exercises in the store

./routes/exercise.js
```js
//...
  let inMem = JSON.parse( JSON.stringify( mockExercises ) );

  routes.get('/exercise', (req, res)=> {
    res.json( inMem );
  });

//...
```

#### CREATE exercise


to create a new exercise, we'll first create a unique id

here I'm assuming ```Math.random()``` will be sufficiently unique. Once we integrate to a database, the database will be in charge of generating the unique ```id```.

./routes/exercise.js
```js
//...

  routes.post('/exercise', (req, res)=> {
    const newId = ''+Math.random();
    const newExercise = JSON.parse( JSON.stringfy( req.body ) );
    
    newExercise.id = newId;
    inMem.push( newExercise );

    res.status(201).json({ createdId: newId });
  });
  
//...
```

also note that we make a copy of ```req.body```, which will avoid any problems of garbage collecting the request object.



#### QUERY exercise

whenever we get a task in server development for a "query" route, our real job is to define a query language which will be possible to apply to our data.

here, our exercises so far only have a ```prompt: 'string'``` and ```answer: ['string']``` with which to query

so it'd be possible to query against which words are in the prompt or answers, but this isn't going to be very feature rich


one feature on the front end will be "exercise packs", which can be implemented as a unique string identifier on each exercise (querying against strict equality will be very easy to implement)

another we may be interested in is having an array of ```tags``` on each exercise - describing the nature of the material (grammar or vocabulary) - which we could query ```tags contains 'string'```


##### extend our exercise schema with pack name, tags for querying

adding to the list of mock exercises will allow our front end devs to build the ```DoExercise``` and ```CreateExercise``` views with all of their basic features using only our fake data.

Front end features
- query lesson pack, then do the lesson
- query exercise by tags, then do the lesson
- create exercises in lesson packs, with queryable tags

(in the next section we'll add UPDATE routes for editing exercises... not quite yet!)

now our exercises will have a bit more to them:

./mocks/exercise.js
```js
//...
  {
    id: '1',
    pack: 'basics',
    tags: ['comparison', 'politics'],
    prompt: 'מסים לא שונים לגניבה ',
    answer: [
      'taxes are no different than theft',
      'tax is theft',
    ],
  },
//...
```

it'll be useful to make at least two different ```pack```s, so the front end can select from between them.



---

program each routeHandler to operate on the inMem

screenshot some POSTMAN testing


Create, Read by id, Patch by id, Query

result create batch

query exercise by tags contains tag / tags



make sure results have tags on them, query result by tag

query result by prompt contains / answer contains

record datetime on result, query result by date range


---


annotate in this step which api calls will have which security features

fill in fake user data where real user session data will be filled in later.


---
---


prioritize APIs for create / edit exercise, do exercise, basic exercise query

query APIs full language is step2