module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`dist/**/*.entity{.ts,.js}`],
  synchronize: Boolean(process.env.DB_SYNC),
};
