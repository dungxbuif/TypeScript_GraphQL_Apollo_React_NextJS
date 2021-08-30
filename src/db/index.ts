// import { Context } from './../types/Context';
import { User, Post } from '../entities';
import { createConnection } from 'typeorm';
import logger from '../config/logger';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloWolrdResolver } from '../entities/resolver/hellowolrd';
import { Express } from 'express';
// import ApolloServerPluginLandingPageGraphQLPlayground from 'apollo-server-core';
require('dotenv').config();

const PORT = process.env.PORT || 6000;
//Postgres
const postgresDB = async () => {
   await createConnection({
      type: 'postgres',
      database: 'reddit',
      username: process.env.DB_USERNAME_DEV,
      password: process.env.DB_PASSWORD_DEV,
      logging: false,
      synchronize: true,
      entities: [User, Post],
   })
      .then(() => logger.succeed('Connect to db succeed'))
      .catch((err) => logger.error('Connect to db failed. ', err.message));
};

//Apollo
const apolloDB = async (app: Express) => {
   try {
      const apolloServer = new ApolloServer({
         schema: await buildSchema({
            resolvers: [HelloWolrdResolver],
            validate: false,
         }),
         // context: ({ req, res }): Context => ({ req, res }),
         // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      });
      await apolloServer.start();
      apolloServer.applyMiddleware({ app, cors: false });

      logger.succeed(
         `GraphQL server is running at  http://localhost:${PORT}${apolloServer.graphqlPath}`,
      );
   } catch (error) {
      logger.error('Connect apollo failed. ', error.message);
   }
};

export default {
   connect: (app: Express) => {
      postgresDB();
      apolloDB(app);
   },
};
