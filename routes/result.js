const mockResults = require('../mocks/result');

module.exports = routes=> {

  let inMem = JSON.parse( JSON.stringify( mockResults ) );
  
  routes.get('/result', (req, res)=> {
    res.json( inMem );
  });

  routes.post('/result', (req, res)=> {
    const newId = ''+Math.random();
    const newResult = JSON.parse( JSON.stringify( req.body ) );
    
    newResult.id = newId;
    inMem.push( newResult );

    res.status(201).json({ createdId: newId });
  });

  routes.post('/result/query', (req, res)=> {
    const matchesPack = !req.body.pack ? inMem : (
      inMem.filter( result => result.pack === req.body.pack )
    );

    const containsWord = !req.body.word ? matchesPack : (
      matchesPack.filter( result => (
        result.prompt.indexOf( req.body.word ) > -1
      ) || (
        result.guess.indexOf( req.body.word) > -1
      ) ) );

    const queryResponse = containsWord;
    
    res.json( queryResponse );
  });
};
