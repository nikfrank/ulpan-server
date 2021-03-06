const mockExercises = require('../mocks/exercise');

module.exports = routes=> {

  let inMem = JSON.parse( JSON.stringify( mockExercises ) );
  
  routes.get('/exercise', (req, res)=> {
    // test that we have all required fields
    
    res.json( inMem );
  });

  routes.post('/exercise', (req, res)=> {
    const newId = ''+Math.random();
    const newExercise = JSON.parse( JSON.stringify( req.body ) );
    
    newExercise.id = newId;
    inMem.push( newExercise );

    res.status(201).json({ createdId: newId });
  });

  routes.post('/exercise/query', (req, res)=> {
    const matchesPack = !req.body.pack ? inMem : (
      inMem.filter( exercise => exercise.pack === req.body.pack )
    );

    const containsTag = !req.body.tag ? matchesPack : (
      matchesPack.filter( exercise => exercise.tags.indexOf( req.body.tag ) > -1 )
    );

    const queryResponse = containsTag;
    
    res.json( queryResponse );
  });


  routes.get('/exercise/packs', (req, res)=>{
    const packs = inMem.map( exercise => exercise.pack );

    const packIndex = {};
    packs.forEach( pack=> (packIndex[pack] = (packIndex[pack]||0) +1 ) );

    res.json(packIndex);
  });
};
