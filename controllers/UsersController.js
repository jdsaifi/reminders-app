const User = require('../models/userModel');
const passwd = require('password-generator');
const { check, validationResult, param } = require('express-validator');

class UsersController {
    constructor(){
        /** Validations */
        this.validations = {
            profile: [
                param('username').exists()
            ],
            socialSignIn: [
                check('auth_provider').exists(),
                check('auth_provider_id').exists(),
                check('auth_provider_access_token').exists(),
                check('username').exists().isString(),
                check('email').exists().bail().isEmail()
            ]
        };
    }

    authorize(req, res){
        res.status(200).json({status: 'okay', msg: 'Authorized'});
    }

    /**
     * Get Self and Other users Profile
     */
    async profile(req, res){
        req.app.dlog("get profile called");
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                msg: 'Something went wrong.',
                data: errors.array()
            });
        }        
        
        const { username } = req.params;
        const select = `auth_provider auth_provider_access_token auth_provider_id createdAt display_name dp email
        first_name last_name updatedAt username`;
        let res_data = {};        

        try{
            if(username === 'me'){
                const { _id } = req.auth.user;
                const user = await User.findOne({ _id }, select);
                res_data = user.toJSON();
            }else{
                const user = await User.findOne({ username }, select);
                
                if(!user) throw new Error("not_found");

                res_data = user.toJSON();
            }
            
            delete res_data.password;
            delete res_data.access_token;

            res.status(200).json({
                status: 'okay',
                msg: 'Profile',
                data: res_data
            });
        }catch(error){
            switch(error.message){
                case 'not_found':
                        res.status(404).json({
                            status: 'error',
                            msg: 'User not found.'
                        }); 
                    break;
                default:
                    res.status(500).json({
                        status: 'error',
                        msg: error.message
                    });
            }
        }
    }
    // End getProfile();

    /**
     * Socal SignIn
     */
    async socialSignIn(req, res){
        let clog = req.app.crlog;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                msg: 'Something went wrong.',
                data: errors.array()
            });
        }        

        let { auth_provider_access_token, auth_provider_id, email } = req.body;
        let res_data = {};
        
        try{

            const user = await User.findOne({ email }, "username email display_name dp auth_provider_id");
            if(!user){
                clog("email not found");

                const socialUser = new User({
                    password: passwd(24, false),
                    ...req['body']
                });

                await socialUser.save();
                const token = await socialUser.getJWT();

                res_data = {
                    id: socialUser._id,
                    username: socialUser.username,
                    email: socialUser.email,
                    display_name: socialUser.display_name,
                    dp: socialUser.dp,
                    access_token: token
                };

            }else{                

                if(user.auth_provider_id === auth_provider_id){
                    // Previews Authentication Found.

                    // Update provider access token
                    await User.updateOne({ email }, {
                        $set: { auth_provider_access_token }
                    });

                    const token = await user.getJWT();
                    res_data = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        display_name: user.display_name,
                        dp: user.dp,
                        access_token: token
                    };
                }else{
                    throw new Error('email_exists')
                }
            }

            res.status(201).json({
                status: 'okay',
                msg: 'SignIn success.',
                data: res_data
            }); 

        }catch(error){
            switch(error.message){
                case 'email_exists':
                        res.status(409).json({
                            status: 'error',
                            msg: 'Email already in use.'
                        }); 
                    break;
                default:
                    res.status(500).json({
                        status: 'error',
                        msg: 'Internal Server Error',
                        data: {
                            errMsg: error.message,
                            error
                        }
                    });
            }
        }
    }
    // End socialSignIn();


}


module.exports = new UsersController();