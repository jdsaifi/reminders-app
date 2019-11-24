const express = require('express');
const APIDebug = require('debug')('API');
const app = express();
const path = require('path');
const morgan = require('morgan');
const config = require('./config');
const colors = require('colors');
const paginate = require('express-paginate');

/** Connect MongoDB First */
const DB = require('./helper/Database');

// Middelware
const auth = require('./middlewares/auth');

/**
 * Log url
 */
app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Day,Authorization');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// limits: limit = 10, maxLimit = 50
app.use(paginate.middleware(10, 50))

// Add global root path
global.__root = path.resolve(__dirname, 'app');

// auth middleware
app.use('/api/v1', auth);

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

if(process.env.NODE_ENV === "production"){
    // const path = require("path");
    // app.use(express.static('frontend/build'));

    // app.get('*', (req, res) => {
    //     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    // })
}

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


const PORT = process.env.PORT || 3001;
const HOST = config.API.HOST || 'localhost';
app.listen(PORT, async (error) => {    
    if (error) {
        console.error('Unable to listen for connections', error);
        process.exit(10);
    }
    APIDebug(`API Server is running on ${config.API.HOST}:${config.API.PORT}`);
});