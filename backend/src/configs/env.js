const requiredByEnv = {
  development: ['JWT_SECRET'],
  test: ['JWT_SECRET'],
  production: ['DATABASE_URL', 'JWT_SECRET'],
};

function validateEnv() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredByEnv[env] || requiredByEnv.development;
  const missing = required.filter((key) => !process.env[key]);

  if (!process.env.DATABASE_URL) {
    const dbKeys = ['DB_NAME', 'DB_USER'];
    missing.push(...dbKeys.filter((key) => !process.env[key]));
  }

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${[...new Set(missing)].join(', ')}`
    );
  }
}

module.exports = { validateEnv };
