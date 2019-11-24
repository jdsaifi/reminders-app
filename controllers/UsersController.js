const User = require('../models/userModel');
const passwd = require('password-generator');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { check, validationResult, param } = require('express-validator');
const _ = require('lodash');

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
        
        const auth = req.auth.user;
        const { username } = req.params;
        const select = `auth_provider auth_provider_access_token auth_provider_id createdAt display_name dp email
        first_name last_name updatedAt username timezone`;
        let res_data = {};        

        try{
            if(username === 'me'){
                // get self profile
                let requests_out_count = 0,
                    requests_in_count = 0,
                    friends_count = 0;
                
                const user = await User.findOne({ _id: auth._id }, select);
    
                const counts = await User.aggregate([
                    { $project: { 
                        _id:1, 
                        username:1, 
                        friends_count: { $size: "$friends" },
                        requests_out_count: { $size: "$friend_requests_out" },
                        requests_in_count: { $size: "$friend_requests_in" },
                    } },
                    { $match: {username: req.auth.user.username} }
                ]);
                
                if(!_.isEmpty(counts)){
                    friends_count = counts[0].friends_count;
                    requests_in_count = counts[0].requests_in_count;
                    requests_out_count = counts[0].requests_out_count;
                }
                
                res_data = { ...user.toJSON(), friends_count, requests_in_count, requests_out_count }
            }else{
                // get other user's profile based on username
                const user = await User.findOne({ username }, select);
                if(!user) throw new Error("not_found");

                const auth = req.auth.user;
                let isFriend = 0;
                let isRequested = 0;
                let self = 0;
                
                if(auth._id.toString() == user._id.toString()){
                    self = 1;
                }

                // check is friend
                isFriend = await User.countDocuments({ 
                    $and: [
                        { username },
                        { friends: { $in: ObjectId(auth._id)} }
                    ]
                });

                if(isFriend === 0){
                    // is requested
                    isRequested = await User.countDocuments({ 
                        $and: [
                            { username },
                            { friend_requests_in: { $in: ObjectId(auth._id)} }
                        ]
                    });
                }

                const counts = await User.aggregate([
                    { $project: { 
                        _id:1, 
                        username:1, 
                        friends_count: { $size: "$friends" },
                    } },
                    { $match: {username: user.username} }
                ]);

                let friends_count = 0;

                if(!_.isEmpty(counts)){
                    friends_count = counts[0].friends_count;
                }


                // Check if this user has send request to user
                const hasRequest = await User.countDocuments({
                    $and: [
                        { username: user.username },
                        { friend_requests_out: { $elemMatch: { $eq: auth._id } } }
                    ]
                });

                // Check if this user has send request to user
                const isBlocked = await User.countDocuments({
                    $and: [
                        { _id: auth._id },
                        { blocked: { $elemMatch: { $eq: user._id } } }
                    ]
                });

                res_data = user.toJSON();
                res_data = {...res_data, 
                    isFriend: !!isFriend, 
                    isRequested: !!isRequested, 
                    self: !!self, 
                    friends_count, 
                    hasRequest: !!hasRequest,
                    isBlocked: !!isBlocked
                }
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

    /**
     * Block User
     */
    async blockUser (req, res) {
        try{
            const auth = req.auth.user;
            const { username } = req.params;

            const contact = await User.findOne({username}, "username");
            
            if(!contact) throw new Error('user_not_found');
            if(contact.username === auth.username) throw new Error('self');

            // is already blocked
            const isBlocked = await User.countDocuments({
                $and: [
                    { _id: auth._id },
                    { blocked: { $elemMatch: { $eq: contact._id } } }
                ]
            });
            if(isBlocked > 0) throw new Error('already_blocked');

            
            // Block contact user and remove from friend & requests list
            await User.updateOne({ _id: auth._id }, {
                $push: { blocked: contact._id },
                $pull: { 
                    friends: contact._id,
                    friend_requests_in: contact._id,
                    friend_requests_out: contact._id
                },
            });

            // remove user from friends & requests list from contact user
            await User.updateOne({ _id: contact._id }, {
                $pull: { 
                    friends: auth._id,
                    friend_requests_in: auth._id,
                    friend_requests_out: auth._id
                 },
            });

            res.status(201).json({
                status: 'okay',
                msg: 'Block user success.'
            });
        }catch(error){
            switch(error.message){   
                case 'user_not_found':
                case 'self':
                    res.status(404).json({
                        status: 'error',
                        msg: 'User not found',
                    });
                    break;
                case 'already_blocked':
                    res.status(201).json({
                        status: 'okay',
                        msg: 'Block user success.'
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
    // End blockUser();

    /**
     * Block User
     */
    async unblockUser (req, res) {
        try{
            const auth = req.auth.user;
            const { username } = req.params;

            const contact = await User.findOne({username}, "username");
            
            if(!contact) throw new Error('user_not_found');
            if(contact.username === auth.username) throw new Error('self');

            // is already blocked
            const isBlocked = await User.countDocuments({
                $and: [
                    { _id: auth._id },
                    { blocked: { $elemMatch: { $eq: contact._id } } }
                ]
            });
            if(isBlocked < 1) throw new Error('not_blocked');

            
            // Block contact user and remove from friend & requests list
            await User.updateOne({ _id: auth._id }, {
                $pull: { 
                    blocked: contact._id
                },
            });
            
            res.status(201).json({
                status: 'okay',
                msg: 'User has been unblocked.'
            });
        }catch(error){
            switch(error.message){   
                case 'user_not_found':
                case 'self':
                    res.status(404).json({
                        status: 'error',
                        msg: 'User not found',
                    });
                    break;
                case 'not_blocked':
                    res.status(201).json({
                        status: 'okay',
                        msg: 'User has been unblocked.'
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
    // End blockUser();


}


module.exports = new UsersController();