require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const abrigoRoute = require('./routes/abrigoRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());  

app.use('/', abrigoRoute);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta  http//:localhost:${PORT}`);
});