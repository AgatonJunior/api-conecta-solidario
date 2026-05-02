const express = require ('express')
const pool = require ('../config/database')
const rotas = express.Router()
const { getDesabrigados, postDesabrigados, patchDesabrigaddos } = require('../controllers/desabrigadosController');
const { validarDesabrigados } = require('../middlewares/desabrigadosValidator');
const { verificarToken } = require('../middlewares/loginAuth');


rotas.get('/desabrigados', verificarToken, getDesabrigados);

rotas.post('/desabrigados', verificarToken, validarDesabrigados, postDesabrigados);

rotas.patch('/desabrigados/:id/saida', verificarToken, validarDesabrigados, patchDesabrigaddos )


module.exports = rotas;