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
