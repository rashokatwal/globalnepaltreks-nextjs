export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'global_nepal_treks',
  port: parseInt(process.env.DB_PORT || '3333'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};