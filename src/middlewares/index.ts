import { COOKIE_NAME, __prod__ } from '../constants';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { Express } from 'express';
import express from 'express';
require('dotenv').config();
const mongoUrl = process.env.MONGODB_URL;

export const middleware = (app: Express) => {
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.set('trust proxy', 1);

   app.use(
      session({
         name: COOKIE_NAME,
         store: MongoStore.create({ mongoUrl }),
         cookie: {
            maxAge: 1000 * 60, // one hour
            httpOnly: true, // JS front end cannot access the cookie
            secure: __prod__, // cookie only works in https
            sameSite: 'none',
         },
         secret: process.env.SESSION_SECRET as string,
         saveUninitialized: false, // don't save empty sessions, right from the start
         resave: false,
      }),
   );
};
