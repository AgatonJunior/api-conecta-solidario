const pool = require('../config/database');

const getDesabrigados = async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT d.*, a.nome AS abrigo_nome, a.cidade AS abrigo_cidade
             FROM desabrigados d
             JOIN abrigos a ON a.id = d.abrigo_id
             WHERE d.saida_em IS NULL
             ORDER BY d.entrada_em DESC`
        );
        return res.status(200).json(resultado.rows); // ✅ era resultado.rows[0]
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar desabrigados' });
    }
};

const postDesabrigados = async (req, res) => {
    const { nome, telefone, num_pessoas, abrigo_id } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const abrigo = await client.query(
            `SELECT vagas_livres FROM abrigos WHERE id = $1`,
            [abrigo_id]
        );

        if (abrigo.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Abrigo não encontrado' });
        }

        if (abrigo.rows[0].vagas_livres < num_pessoas) {
            await client.query('ROLLBACK');
            return res.status(400).json({ erro: 'Vagas insuficientes neste abrigo' });
        }

        const resultado = await client.query(
            `INSERT INTO desabrigados (nome, telefone, num_pessoas, abrigo_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nome, telefone, num_pessoas, abrigo_id]
        );

        await client.query(
            `UPDATE abrigos SET vagas_livres = vagas_livres - $1 WHERE id = $2`,
            [num_pessoas, abrigo_id]
        );

        await client.query('COMMIT');
        return res.status(201).json(resultado.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao cadastrar desabrigado:', error);
        return res.status(500).json({ erro: 'Erro ao cadastrar desabrigado' });
    } finally {
        client.release();
    }
};

const patchDesabrigaddos = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const resultado = await client.query(
            `SELECT abrigo_id, num_pessoas, saida_em FROM desabrigados WHERE id = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Desabrigado não encontrado' });
        }

        const desabrigado = resultado.rows[0];

        if (desabrigado.saida_em !== null) {
            await client.query('ROLLBACK');
            return res.status(400).json({ erro: 'Saída já registrada para este desabrigado' });
        }

        await client.query(
            `UPDATE desabrigados SET saida_em = NOW() WHERE id = $1`,
            [id]
        );

        await client.query(
            `UPDATE abrigos SET vagas_livres = vagas_livres + $1 WHERE id = $2`,
            [desabrigado.num_pessoas, desabrigado.abrigo_id]
        );

        await client.query('COMMIT');
        return res.status(200).json({ mensagem: 'Saída registrada com sucesso' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao registrar saída:', error);
        return res.status(500).json({ erro: 'Erro ao registrar a saída' });
    } finally {
        client.release();
    }
};

module.exports = { getDesabrigados, postDesabrigados, patchDesabrigaddos };
