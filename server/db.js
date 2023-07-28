const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "D3rp201!D3rp201!",
    host: "localhost",
    port: 5432,
    database: "styleguide"
})

module.exports = pool;