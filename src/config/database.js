const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    connectionTimeoutMillis: 5000,  // 👈 erro em 5s em vez de travar
    idleTimeoutMillis: 30000,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erro na conexão:', err.message); // vai aparecer o erro real
    } else {
        console.log('✅ Banco conectado!');
        release();
    }
});

module.exports = pool;