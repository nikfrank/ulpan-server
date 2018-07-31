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


# Section 1: Using ExpressJS to expose an API

```$ git checkout step0```

we're starting with nothing more than a package.json and an empty index.js file


let's install ```express```, the standard web server framework for node.


```$ yarn add express```
