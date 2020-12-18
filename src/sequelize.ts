import { Sequelize } from 'sequelize-typescript';
import { SEQ_CONFIG } from './config/sequelize.config';

const env = process.env.NODE_ENV || 'development';
const config = SEQ_CONFIG[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    define: {
      timestamps: false
    },
    timezone: "+09:00",
    models: [__dirname + '/model']
  }
);