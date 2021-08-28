import express from 'express';
import 'reflect-metadata';
import db from './db';
import log from './config/logger';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// connect to db
db();

app.listen(PORT, () => log.cyan(`Server is running at http://localhost:${PORT}`));
