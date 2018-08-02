const mockExercises = require('../mocks/exercise');

module.exports = routes=> {

  let inMem = JSON.parse( JSON.stringify( mockExercises ) );
  
  routes.get('/exercise', (req, res)=> {
    res.json( inMem );
  });

  routes.post('/exercise', (req, res)=> {
    const newId = ''+Math.random();
    const newExercise = JSON.parse( JSON.stringfy( req.body ) );
    
    newExercise.id = newId;
    inMem.push( newExercise );

    res.status(201).json({ createdId: newId });
  });

  routes.post('/exercise/query', (req, res)=> {
    console.log( req.body );

    // here we'll filter inMem based on the query from req.body

    res.json( inMem );
  });
};
