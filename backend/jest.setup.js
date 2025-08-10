// jest.setup.js
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

const db = require('./src/configs/db');

// Cierra la conexión UNA SOLA VEZ al final de todos los tests
afterAll(async () => {
  await db.close();
});
