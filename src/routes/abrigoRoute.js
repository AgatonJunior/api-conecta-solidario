const express = require('express');
const pool = require('../config/database');
const { getAbrigos, postAbrigos, putAbrigos, deleteAbrigos } = require ( '../controllers/abrigoController');

const rotas = express.Router();

rotas.get('/', (req, res) => {
    res.send('<h1>Conecta Solidário</h1>');
});

rotas.get('/abrigos', getAbrigos);

rotas.post('/abrigos', postAbrigos);

rotas.put('/abrigos/:id', putAbrigos);

rotas.delete('/abrigos/:id', deleteAbrigos);

module.exports = rotas;
