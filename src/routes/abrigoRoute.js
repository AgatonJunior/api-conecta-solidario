const express = require('express');
const pool = require('../config/database');
const { getAbrigos, postAbrigos, putAbrigos, deleteAbrigos } = require ( '../controllers/abrigoController');
const validarAbrigo = require('../middlewares/abrigoValidator');
const {verificarToken} = require('../middlewares/loginAuth')

const rotas = express.Router();

rotas.get('/', (req, res) => {
    res.send('<h1>Conecta Solidário</h1>');
});

rotas.get('/abrigos', verificarToken, getAbrigos);

rotas.post('/abrigos', verificarToken, validarAbrigo, postAbrigos);

rotas.put('/abrigos/:id',   verificarToken, validarAbrigo, putAbrigos);

rotas.delete('/abrigos/:id', verificarToken, deleteAbrigos);

module.exports = rotas;
