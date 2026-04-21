require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const abrigoRoute = require('./routes/abrigoRoute');
const voluntariosRoute = require('./routes/voluntariosRoute')

const server = express();
const PORT = process.env.PORT || 3000;

// Middleware
server.use(cors());
server.use(express.json());  
server.use(express.urlencoded({ extended: true }));

// Rotas
server.use('/', abrigoRoute); 
server.use('/', voluntariosRoute)
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta  http//:localhost:${PORT}`);
});