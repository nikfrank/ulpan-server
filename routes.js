const express = require('express');
const routes = express.Router();


const fakeExercises = [
  {
    prompt: 'עישון שווה לעבדות',
    answer: [
      'smoking is slavery',
      'smoking equals slavery',
    ],
  },
  {
    prompt: 'מסים לא שונים לגניבה ',
    answer: [
      'taxes are no different than theft',
      'tax is theft',
    ],
  },
  {
    prompt: 'לא אפשר לחנות בתל אביב',
    answer: [
      'you can not park in Tel Aviv',
      'you can\'t park in Tel Aviv',
      'it is impossible to park in Tel Aviv',
      'it\'s impossible to park in Tel Aviv',
      'there\'s no parking in Tel Aviv',
    ],
  },
];

routes.get('/exercise', (req, res)=> {
  res.json( fakeExercises );
});

routes.post('/result', (req, res)=> {
  // pretend to save the result, respond with a successMessage
  console.log( req.body );
  res.status(201).json({ createdId: '1308f183nf' });
});

module.exports = routes;
