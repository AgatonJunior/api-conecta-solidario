const express = require('express');
const pool = require('../config/database');
const { getVoluntarios, postVoluntarios, deleteVoluntarios, putVoluntarios } = require('../controllers/voluntariosController');

const rotas = express.Router();

rotas.get('/voluntarios', getVoluntarios);

rotas.post('/voluntarios', postVoluntarios );

rotas.put('/voluntarios/:id', putVoluntarios );

rotas.delete('/voluntarios/:id', deleteVoluntarios );

module.exports = rotas;