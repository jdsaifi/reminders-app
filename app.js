const express = require('express');
const APIDebug = require('debug')('API');
const app = express();
const path = require('path');
const morgan = require('morgan');
// const config = require('./config');
const colors = require('colors');

/** Connect MongoDB First */
const DB = require('./helper/Database');


/**
 * Log url
 */
app.use(morgan('dev'))

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token, X-Day');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Add global root path
global.__root = path.resolve(__dirname, 'app');

// include route
app.use('/', require('./routes'));

// NOT FOUND
app.use( (req, res, next) => {
    const error = new Error('Invalid URL');
    res.status(404).json({
        'status': 'error',
        'code': 404,
        'msg': 'Invlid URL'
    });
    next(error);
});

/** Debug console */
app.dlog = APIDebug;

// Add color red log for errors
app.crlog = (er) => {
    console.error(colors.red(er));
    return;
};

// print uncaught exception
process.on('uncaughtException', function (err) {
    console.error(colors.red("[uncaughtException]"), colors.red(err.stack));
});




module.exports = app;