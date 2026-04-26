const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
});
module.exports = pool;