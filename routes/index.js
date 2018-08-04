const express = require('express');
const routes = express.Router();

const applyExerciseRoutes = require('./exercise');
const applyResultRoutes = require('./result');

applyExerciseRoutes( routes );
applyResultRoutes( routes );

module.exports = routes;
