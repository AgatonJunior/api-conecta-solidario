const express = require('express');
const pool = require('../config/database');

const rotas = express.Router();

rotas.get('/', (req, res) => {
    res.send('<h1>Conecta Solidário</h1>');
});

rotas.get('/abrigos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM abrigos');
        res.json(resultado.rows);
    } catch (error) {
        console.error('Erro GET /abrigos:', error.message); // 👈 obrigatório
        res.status(500).json({ error: error.message });
    }
});

rotas.post('/abrigos', async (req, res) => {
    const { nome, endereco, cidade, telefone, capacidade, vagas_livres } = req.body;

    try {
        const resultado = await pool.query(
            `INSERT INTO abrigos (nome, endereco, cidade, telefone, capacidade, vagas_livres)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nome, endereco, cidade, telefone, capacidade, vagas_livres]
        );
        res.status(201).json({ mensagem: 'Abrigo cadastrado com sucesso', post: resultado.rows[0] });
    } catch (error) {
        console.error('Erro POST /abrigos:', error.message); // 👈 obrigatório
        res.status(500).json({ error: error.message });
    }
});

module.exports = rotas;
