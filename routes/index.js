const express = require('express');
const routes = express.Router();

const applyExerciseRoutes = require('./routes/exercise');
const applyResultRoutes = require('./routes/result');

applyExerciseRoutes( routes );
applyResultRoutes( routes );

module.exports = routes;
