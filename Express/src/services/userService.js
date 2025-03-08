const pool = require('../database/config');
const queries = require('../database/queries');

const getAllUsers = async () => {
    const { rows } = await pool.query(queries.getUsuarios);
    return rows;
};

module.exports = {
    getAllUsers
};
