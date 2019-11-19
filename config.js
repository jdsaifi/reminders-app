const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    API: {
        PORT: process.env.API_SERVER_PORT || 80,
        HOST: process.env.API_SERVER_HOST || 'localhost'
    },
    DB: {
        mongodb: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`,
        mongodb_connection_string: process.env.MONGO_CONNECT_STR
    },
    EMAIL: {},
    JWTSKEY: process.env.JWT_SKEY
};