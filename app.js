'use strict';

const http = require('http');
require('dotenv').config();

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const session = require('express-session');
const app = express();

const es6renderer = require('express-es6-template-engine');
app.engine('html', es6renderer);
app.set('views', './views');
app.set('view engine', 'html');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    is_logged_in: false
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

const rootController = require('./routes/index');
const userController = require('./routes/users');
const linksController = require('./routes/links');

app.use('/', rootController);
app.use('/users', userController);
app.use('/links', linksController);
