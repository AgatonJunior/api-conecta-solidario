require('dotenv').config();
const pool = require('../config/database');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const criarAdmin = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' });
    }

    try {

        const emailExistente = await pool.query(
            `SELECT id FROM admins WHERE email = $1`, [email]
        );
        if (emailExistente.rows.length > 0) {
            return res.status(409).json({ erro: 'E-mail já cadastrado' });
        }   

        const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);

        const resultado = await pool.query(
            `INSERT INTO admins (nome, email, senha_hash)
             VALUES ($1, $2, $3)
             RETURNING id, nome, email`,
            [nome, email, senha_hash]
        );
        return res.status(201).json({
            mensagem: 'Admin criado com sucesso',
            admin: resultado.rows[0] 
        });
    } catch (error) {
    console.error('ERRO REAL:', error);
    return res.status(500).json({ erro: error.message });
}
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'email e senha são obrigatórios' });
    }

    try {
        const resultado = await pool.query(
            `SELECT * FROM admins WHERE email = $1`,
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas' });
        }

        const senhaValida = await bcrypt.compare(senha, resultado.rows[0].senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: resultado.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao fazer login' });
    }
};

module.exports = { criarAdmin, login };