const express = require('express');
const pool = require('../config/database');

const getAbrigos = async (req, res) => {
     try {
        const resultado = await pool.query('SELECT * FROM abrigos');
        res.json(resultado.rows);
    } catch (error) {
        console.error('Erro GET /abrigos:', error.message);
        res.status(500).json({ error: 'Erro ao buscar os abrigos' });
    }
};

const postAbrigos = async (req, res) => {
    const { nome, endereco, cidade, telefone, capacidade, vagas_livres } = req.body;

    try {
        const resultado = await pool.query(
            `INSERT INTO abrigos (nome, endereco, cidade, telefone, capacidade, vagas_livres)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nome, endereco, cidade, telefone, capacidade, vagas_livres]
        );
        res.status(201).json({ mensagem: 'Abrigo cadastrado com sucesso', post: resultado.rows[0] });
    } catch (error) {
        console.error('Erro POST /abrigos:', error.message); 
        res.status(500).json({ error: 'Erro ao cadastrar o abrigo' });
    }

}

 const putAbrigos = async (req, res) => {
        const { id } =req.params
        const { nome, endereco, cidade, telefone, capacidade, vagas_livres } = req.body;

        if (!nome || !endereco || !cidade) {
        return res.status(400).json({
            erro: 'Nome, endereço e cidade são obrigatórios'
        });
    }

    if (capacidade < 0 || vagas_livres < 0) {
        return res.status(400).json({
            erro: 'Capacidade e vagas não podem ser negativas'
        });
    }

        try {
            const resultado = await pool.query(
                `UPDATE abrigos 
                SET nome = $1, endereco =$2, cidade = $3, telefone = $4, capacidade = $5, vagas_livres = $6
                WHERE id = $7
                RETURNING *`,
                [nome, endereco, cidade, telefone, capacidade, vagas_livres, id]
            );

            if (resultado.rowCount === 0) {
                res.status(404).json({ error: 'Abrigo não encontrado' });
            } else {
                res.status(200).json({ post: resultado.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o abrigo' });
        }
    }

const deleteAbrigos =  async (req, res) => {
        const { id } = req.params;  

        const resultado = await pool.query('DELETE FROM abrigos WHERE id = $1', [id]);

        if (resultado.rowCount === 0) {
            res.status(404).json({ error: 'Abrigo não encontrado' });
        } else {
            res.status(204).json({ mensagem: 'Abrigo deletado com sucesso' });
        }

    }

module.exports = {
    getAbrigos,
    postAbrigos,
    putAbrigos,
    deleteAbrigos
};