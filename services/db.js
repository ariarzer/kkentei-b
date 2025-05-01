require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_URL_LOCAL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function all(sql) {
    try {
        const result = await pool.query(sql);
        return result.rows;
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    all
};