import { middleware } from './middlewares';
import express from 'express';
import 'reflect-metadata';
import db from './db';
import log from './config/logger';
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

middleware(app);

app.get('/', (req, res) => {
   res.send('Hello wolrd');
});

// connect to db
db.connect(app);

app.listen(PORT, () => log.cyan(`Server is running at http://localhost:${PORT}`));
