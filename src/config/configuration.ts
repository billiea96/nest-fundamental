export default () => ({
  port: parseInt(process.env.PORT),
  secret: process.env.JWT_SECRET,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  dbName: process.env.DB_NAME,
  NODE_ENV: process.env.NODE_ENV,
});
