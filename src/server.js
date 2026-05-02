require('dotenv').config();
const express = require('express');
const cors = require('cors');
const abrigoRoute = require('./routes/abrigoRoute');
const voluntariosRoute = require('./routes/voluntariosRoute')
const desabrigadosRoute = require('./routes/desabrigadosRoute')
const loginRoute = require('./routes/loginRoute');  
const dashboardRoute = require('./routes/dashboard');

const server = express();
const PORT = process.env.PORT || 3000;

// Middleware
server.use(cors());
server.use(express.json());  
server.use(express.urlencoded({ extended: true }));

// Rotas
server.use('/', abrigoRoute); 
server.use('/', voluntariosRoute);
server.use('/', desabrigadosRoute);
server.use('/', loginRoute);
server.use('/dashboard', dashboardRoute)


server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});