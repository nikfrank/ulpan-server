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


# Section 0: ...



---


## installation

```
$ cd ~/code
$ git clone https://github.com/nikfrank/ulpan-server
$ cd ulpan-server
$ git checkout step0
```


# Section 1: Using ExpressJS to expose an API

```$ git checkout step0```

we're starting with nothing more than a package.json and an empty index.js file


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


