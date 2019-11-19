const User = require('../models/userModel');

class FriendsController{
    constructor() {};

    async sendRequest(req, res) {
        let clog = req.app.crlog;
        clog('send friend request called');
        const mongoose = require('mongoose');
        const ObjectId = mongoose.Types.ObjectId;

        try{
            const { body } = req;
            const { to } = body;
            
            const { user } = req.auth;

            
            const [ is_friend, already_requested ] = await Promise.all([
                User.findOne({
                    $and: [
                        { _id: ObjectId(user._id) },
                        { friends: { $elemMatch: { $eq: ObjectId(to) } } }
                    ]
                }),
                User.countDocuments({
                    $and: [
                        { _id: ObjectId(user._id) },
                        { friend_requests_out: { $elemMatch: { $eq: ObjectId(to) } } }
                    ]
                })
            ]);

            if(is_friend){
                throw new Error('already_friends');
            }
            
            if(already_requested){
                throw new Error('already_requested');
            }

            const [ save_friend_requests_out, save_friend_requests_in ] = await Promise.all([
                // Save friend requests out to sender
                User.updateOne({ _id: ObjectId(user._id) }, {
                    $push: { friend_requests_out: ObjectId(to) }
                }),

                // Save friend request to recipent
                User.updateOne({ _id: ObjectId(to) }, {
                    $push: { friend_requests_in: ObjectId(user._id) }
                })
            ]);

            res.status(201).json({
                status: 'okay',
                msg: 'Your friend request has been submitted.'
            });
        }catch(error){
            switch(error.message){   
                case 'already_friends':
                    res.status(200).json({
                        status: 'okay',
                        msg: 'You both are already friends.'
                    });
                    break;
                case 'already_requested':
                    res.status(200).json({
                        status: 'okay',
                        msg: 'You have already submitted a friend request.'
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

}

module.exports = new FriendsController();