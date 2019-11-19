const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const WHITLE_LIST_URL = [
    '/api/v1/login',
    '/api/v1/signup',
    '/api/v1/social-signin',
];

const auth = async (req, res, next) => {

    if(WHITLE_LIST_URL.includes(req.originalUrl)){
        return next();
    }else{
        console.log("");
        console.log("header: ", req.headers);
        
        try{
            const token = req.header('Authorization').replace('Bearer ', '');
            const data = jwt.verify(token, config.JWTSKEY);

            const user = await User.findOne({_id: data.id}, {_id:1, username: 1});
            if(!user) throw new Error();

            req.auth = {user};
            next();
        }catch(error){
            res.status(401).json({
                status: 'error',
                msg: 'Not authorized to access this resource'
            });
        }
    }
    
}

module.exports = auth;