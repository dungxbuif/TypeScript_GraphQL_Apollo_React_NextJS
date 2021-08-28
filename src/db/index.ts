import { User } from './../entities/User';
import { createConnection } from 'typeorm';
import logger from '../config/logger';

const main = async () => {
   await createConnection({
      type: 'postgres',
      database: 'reddit',
      username: process.env.DB_USERNAME_DEV,
      password: process.env.DB_PASSWORD_DEV,
      logging: false,
      synchronize: true,
      entities: [User],
   })
      .then(() => logger.succeed('Connect to db succeed'))
      .catch((err) => logger.error('Connect to db failed. ', err.message));
};

export default main;
