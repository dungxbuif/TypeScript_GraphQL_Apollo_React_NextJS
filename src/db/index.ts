import { HelloWolrdResolver } from '../resolver/hello';
// import { Context } from './../types/Context';
import { User, Post } from '../entities';
import { createConnection } from 'typeorm';
import logger from '../config/logger';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolver/user';
import { Express } from 'express';
import mongoose from 'mongoose';
// import ApolloServerPluginLandingPageGraphQLPlayground from 'apollo-server-core';
require('dotenv').config();

const PORT = process.env.PORT || 6000;
const mongoUrl = process.env.MONGODB_URL;

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
            resolvers: [UserResolver, HelloWolrdResolver],
            validate: false,
         }),
         // context: ({ req, res }): Context => ({ req, res }),
         // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      });
      await apolloServer.start();
      apolloServer.applyMiddleware({ app, cors: true });

      logger.succeed(
         `GraphQL server is running at  http://localhost:${PORT}${apolloServer.graphqlPath}`,
      );
   } catch (error) {
      logger.error('Connect apollo failed. ', error.message);
   }
};

//MongoDB
const mongoDB = async () => {
   try {
      await mongoose.connect(mongoUrl as string);

      logger.succeed('MongoDB Connected');
   } catch (error) {
      logger.error('MongoDB Connected', error.message);
   }
};
export default {
   connect: (app: Express) => {
      postgresDB();
      apolloDB(app);
      mongoDB();
   },
};
