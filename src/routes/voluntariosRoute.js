const express = require('express');
const { getVoluntarios, postVoluntarios, putVoluntarios, patchDisponibilidade, deleteVoluntarios } = require('../controllers/voluntariosController');
const { validarVoluntarios, validarDisponibilidade } = require('../middlewares/voluntariosValidator'); 
const { verificarToken } = require('../middlewares/loginAuth'); 
const rotas = express.Router();

rotas.get('/voluntarios', verificarToken, getVoluntarios);

rotas.post('/voluntarios', verificarToken, validarVoluntarios, postVoluntarios);

rotas.put('/voluntarios/:id', verificarToken, validarVoluntarios, putVoluntarios);

rotas.patch('/voluntarios/:id/disponibilidade', verificarToken, validarDisponibilidade, patchDisponibilidade);

rotas.delete('/voluntarios/:id', verificarToken, deleteVoluntarios);

module.exports = rotas;