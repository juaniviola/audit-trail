export default (): object => ({
  port: parseInt(process.env.PORT || '5000', 10),
  environment: process.env.ENVIRONMENT || 'development',
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map((o) => o.trim()),
  },
  swagger: {
    path: process.env.SWAGGER_PATH || 'documentation',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'audit_trail',
  },
});
