// tests/utils/resetDatabase.js
const db = require('../../src/configs/db');

module.exports = async function resetDatabase() {
  await db.sync({ force: true }); // Elimina y vuelve a crear la base de datos
};
