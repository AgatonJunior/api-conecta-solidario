const express = require('express');
const pool = require('../config/database');
const { getVoluntarios, postVoluntarios, deleteVoluntarios, putVoluntarios, patchDisponibilidade } = require('../controllers/voluntariosController');
const { validarVoluntarios } = require('../middlewares/voluntariosValidator');

const rotas = express.Router();

rotas.get('/voluntarios', getVoluntarios);

rotas.post('/voluntarios', validarVoluntarios, postVoluntarios );

rotas.put('/voluntarios/:id', validarVoluntarios, putVoluntarios );

rotas.patch('/:id/disponibilidade', validarVoluntarios, patchDisponibilidade );

rotas.delete('/voluntarios/:id', deleteVoluntarios );

module.exports = rotas;