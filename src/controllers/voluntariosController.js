const pool = require('../config/database');

const getVoluntarios = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                v.*,
                COALESCE(
                    ARRAY_AGG(h.nome) FILTER (WHERE h.nome IS NOT NULL),
                    '{}'
                ) AS habilidades
            FROM voluntarios v
            LEFT JOIN voluntario_habilidade vh ON vh.voluntario_id = v.id
            LEFT JOIN habilidades h ON h.id = vh.habilidade_id
            GROUP BY v.id
            ORDER BY v.nome
        `);
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar voluntários:', error);
        res.status(500).json({ erro: 'Erro ao listar voluntários' });
    }
};

const postVoluntarios = async (req, res) => {
    const { nome, email, telefone, cidade, disponivel, habilidades_ids } = req.body;

    const client = await pool.connect();
    try {

        await client.query('BEGIN');
        const resultado = await client.query(
            `INSERT INTO voluntarios (nome, email, telefone, cidade, disponivel)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [nome, email, telefone, cidade, disponivel]
        );

        const voluntario = resultado.rows[0];
        for (const habilidade_id of habilidades_ids) {
            await client.query(
                `INSERT INTO voluntario_habilidade (voluntario_id, habilidade_id)
                 VALUES ($1, $2)`,
                [voluntario.id, habilidade_id]
            );
        }

        await client.query('COMMIT');
        return res.status(201).json({
            ...voluntario,
            habilidades_ids
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar voluntário:', error);
        return res.status(500).json({ erro: 'Erro ao criar voluntário' });
    } finally {
        client.release();
    }
};

const putVoluntarios = async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cidade, disponivel } = req.body;
    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const resultado = await pool.query(
            `UPDATE voluntarios
            SET nome = $1, email = $2, telefone = $3, cidade = $4, disponivel = $5
            WHERE id = $6
            RETURNING *`,
            [nome, email, telefone, cidade, disponivel, id]
        );

        if (resultado.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'Voluntário não encontrado' });
        };

        await client.query(
            `DELETE FROM voluntario_habilidade WHERE voluntario_id = $1`,
            [id]
        );
        for (const habilidade_id of habilidades_ids) {
            await client.query(
                `INSERT INTO voluntario_habilidade (voluntario_id, habilidade_id)
                 VALUES ($1, $2)`,
                [id, habilidade_id]
            );
        }

        await client.query('COMMIT');
        return res.status(200).json({ ...resultado.rows[0], habilidades_ids });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao atualizar voluntário:', error);
        return res.status(500).json({ erro: 'Erro ao atualizar voluntário' });
    } finally {
        client.release();
    }
};

const patchDisponibilidade = async (req, res) => {
    const { id } = req.params;
    const { disponivel } = req.body;

    try {
        const resultado = await pool.query(
            `UPDATE voluntarios
            SET disponivel = $1
            WHERE id = $2
            RETURNING *
            `,
            [disponivel, id]
        );
        return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar disponibilidade do voluntário:', error);
        return res.status(500).json({ erro: 'Erro ao atualizar disponibilidade do voluntário' });
    }
}

const deleteVoluntarios = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            `DELETE FROM voluntarios
            WHERE id = $1
            RETURNING *`,
            [id]
        );
        return res.status(200).json({ mensagem: 'Voluntário excluído com sucesso!    ' });
    } catch (error) {
        console.error('Erro ao excluir voluntário:', error);
        return res.status(500).json({ erro: 'Erro ao excluir voluntário' });
    }
};

module.exports = {
    getVoluntarios,
    postVoluntarios,
    putVoluntarios,
    patchDisponibilidade,
    deleteVoluntarios
}