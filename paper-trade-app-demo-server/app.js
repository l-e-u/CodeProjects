import express from 'express';
import 'dotenv/config';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import tradesRouter from './routes/trades';

import models, { connectDb } from './models';

const app = express();

app.use((req, res, next) => {
    req.context = {
        models
    };
    next();
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trades', tradesRouter);

connectDb().then(async () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}...`);
    })
})

module.exports = app;
