const express = require ('express')
const pool = require ('../config/database')
const rotas = express.Router()
const { getDesabrigados, postDesabrigados, patchDesabrigaddos } = require('../controllers/desabrigadosController');
const { validarDesabrigados } = require('../middlewares/desabrigadosValidator');


rotas.get('/desabrigados', getDesabrigados);

rotas.post('/desabrigados', validarDesabrigados, postDesabrigados);

rotas.patch('/desabrigados/:id/saida', validarDesabrigados, patchDesabrigaddos )


module.exports = rotas;