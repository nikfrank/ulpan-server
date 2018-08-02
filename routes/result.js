const mockResults = require('../mocks/result');

module.exports = routes=> {

  let inMem = JSON.parse( JSON.stringify( mockResults ) );
  
  routes.get('/result', (req, res)=> {
    res.json( inMem );
  });

  routes.post('/result', (req, res)=> {
    console.log( req.body );

    // here we'll save the value from req.body into our in memory store

    res.status(201).json({ createdId: '1308f183nf' });
  });

  routes.post('/result/query', (req, res)=> {
    console.log( req.body );

    // here we'll filter inMem based on the query from req.body

    res.json( inMem );
  });
};
