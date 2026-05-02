const express = require('express');
const rotas  = express.Router();
const pool = require('../config/database');
const { verificarToken } = require('../middlewares/loginAuth');

rotas.get('/', verificarToken, async (req, res) => {
  try {
    const [abrigos, voluntarios, desabrigados, vagas] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM abrigos WHERE ativo = TRUE`),
      pool.query(`SELECT COUNT(*) FROM voluntarios WHERE disponivel = TRUE`),
      pool.query(`SELECT COUNT(*) FROM desabrigados WHERE saida_em IS NULL`),
      pool.query(`SELECT SUM(vagas_livres) FROM abrigos WHERE ativo = TRUE`),
    ]);
    res.json({
      total_abrigos_ativos:      parseInt(abrigos.rows[0].count),
      total_voluntarios_disponiveis: parseInt(voluntarios.rows[0].count),
      total_desabrigados_atual:  parseInt(desabrigados.rows[0].count),
      total_vagas_livres:        parseInt(vagas.rows[0].sum || 0),
    });
  } catch (error) {
    res.status(500).json({ error:"Erro ao consultar o banco de dado!"});
  }
});

module.exports = rotas;