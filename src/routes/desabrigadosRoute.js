const express = require ('express')
const pool = require ('../config/database')
const rotas = express.Router()
const { getDesabrigados, postDesabrigados, patchDesabrigaddos } = require('../controllers/desabrigadosController')


rotas.get('/desabrigados', getDesabrigados);

rotas.post('/desabrigados', postDesabrigados);

rotas.patch('/desabrigados/:id/saida', patchDesabrigaddos )


module.exports = rotas;