const mongoose = require('mongoose');
const config = require('../config');
const dAPI = require('debug')('API');

        

class Database {
    constructor(){
        this.__connect();
        // mongoose.set('debug', true);
    }

    __connect(){
        mongoose.connect(config.DB.mongodb_connection_string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        }).then( () => {
            dAPI("mongodb connected!");
        })
        .catch(error =>{
            console.error(error);
            process.exit();
        });
    }
}

module.exports = new Database();