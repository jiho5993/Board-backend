import dotenv from 'dotenv';
dotenv.config();

export const SEQ_CONFIG: any = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": "localhost",
    "dialect": "mysql",
    "operatorsAliases": false
  }
};