const express = require('express');
const rotas = express.Router();
const { criarAdmin, login } = require('../controllers/loginController');
const { verificarToken } = require('../middlewares/loginAuth');

rotas.post('/cadastrarUsuario', criarAdmin);
rotas.post('/loginUsuario', login);

module.exports = rotas;
