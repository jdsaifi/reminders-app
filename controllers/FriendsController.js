const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/userModel');
const { check, validationResult } = require('express-validator');

class FriendsController{
    constructor() {
        /** Validations */
        this.validations = {
            sendRequest: [
                check('to').exists().isString()
            ],
        };
    };

    async sendRequest(req, res) {
        let clog = req.app.crlog;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                msg: 'Something went wrong.',
                data: errors.array()
            });
        }       

        clog('send friend request called');

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
                        msg: 'You both are already friends.',
                        code: 'already_friends'
                    });
                    break;
                case 'already_requested':
                    res.status(200).json({
                        status: 'okay',
                        msg: 'You have already submitted a friend request.',
                        code: 'already_requested'
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

    /**
     * Get friend requests list
     */
    async requests(req, res) {
        const clog = req.app.crlog;
        clog("requests() called");

        const { user } = req.auth;

        try{
            let where = {
                _id: user._id
                // $and: [
                //     { remind_on: { $gt: moment.utc() } },
                //     { 
                //         $or: [
                //             { owner: user._id },
                //             { friends: { $in: [ user._id ] } }
                //         ] 
                //     }
                // ]
            };

            const select = '-__v';
            
            let [ count, requestsInList ] = await Promise.all([
                User.countDocuments(where),
                User.find(where, '_id')
                .populate('friend_requests_in', '_id username email display_name first_name last_name dp createdAt')
                .sort('remind_on')
                // .limit(req.query.limit)
                // .skip(req.skip)
                .lean().exec()
            ]);
console.log(requestsInList);
            let results = requestsInList;

            //const pageCount = Math.ceil(count / req.query.limit);

            if(results.length > 0){
                res.status(200).json({
                    status: 'okay',
                    msg: 'Requests in',
                    data: results,
                    // meta:{
                    //     items_count: count,
                    //     pages_count: pageCount,
                    //     current_page: req.query.page,
                    //     has_next: paginate.hasNextPages(req)(pageCount)
                    // }
                });
            }else{
                res.status(404).json({
                    status: "okay",
                    msg: "Data not found."
                });
            }
            
        }catch(error){
            switch(error.message){                
                default:
                    res.status(500).json({
                        status: 'error',
                        msg: error.message
                    });
            }
        }
    }
    // End requests();

    /**
     * Accept friend request
     */
    async acceptRequest(req, res) {
        const clog = req.app.crlog;
        clog("acceptRequest() called");

        const auth = req.auth.user;

        try{
            const { username } = req.params;
            
            // Check if request exists
            const isRequestExists = await User.countDocuments({
                $and: [
                    { username },
                    { friend_requests_out: { $elemMatch: { $eq: auth._id } } }
                ]
            });
            
            if(!!isRequestExists == false){
                throw new Error('request_not_found');
            }

            // Check if user is already friend
            const isFriend = await User.countDocuments({
                $and: [
                    { username },
                    { friends: { $elemMatch: { $eq: auth._id } } }
                ]
            });
            if(!!isFriend == true){
                throw new Error('already_friend');
            }

            // get contact's id
            const user = await User.findOne({ username }, "_id, username");

            const [ update_friend_in_user, update_friend_in_contact] = await Promise.all([
                // Add friend in user's profile
                User.updateOne({ _id: ObjectId(auth._id) }, {
                    $push: { friends: ObjectId(user._id) }
                }),

                // Add friend in contact's profile
                User.updateOne({ _id: ObjectId(user._id) }, {
                    $push: { friends: ObjectId(auth._id) }
                }),

                // Delete request from user's profile
                User.updateOne({ _id: ObjectId(auth._id) }, {
                    $pull: { friend_requests_in: ObjectId(user._id) }
                }),

                // Delete request from contact's profile
                User.updateOne({ _id: ObjectId(user._id) }, {
                    $pull: { friend_requests_out: ObjectId(auth._id) }
                }),

            ]);


            res.status(201).json({
                status: 'okay',
                msg: 'Request accepted'
            });

        }catch(error){
            switch(error.message){   
                case 'already_friend':
                    res.status(200).json({
                        status: 'okay',
                        msg: 'You both are already friends.',
                        code: 'already_friend'
                    });
                    break;
                case 'request_not_found':
                    res.status(404).json({
                        status: 'okay',
                        msg: 'Request not found',
                        code: 'request_not_found'
                    });
                    break;
                default:
                    res.status(500).json({
                        code: 'error',
                        status: 'error',
                        msg: error.message
                    });
            }
        }
    }
    // End acceptRequest();

    /**
     * Reject friend request
     */
    async rejectRequest(req, res) {
        const clog = req.app.crlog;
        clog("rejectRequest() called");

        const auth = req.auth.user;

        try{
            const { username } = req.params;
            
            // Check if request exists
            const isRequestExists = await User.countDocuments({
                $and: [
                    { username },
                    { friend_requests_out: { $elemMatch: { $eq: auth._id } } }
                ]
            });
            
            if(!!isRequestExists == false){
                throw new Error('request_not_found');
            }

            // Check if user is already friend
            const isFriend = await User.countDocuments({
                $and: [
                    { username },
                    { friends: { $elemMatch: { $eq: auth._id } } }
                ]
            });
            if(!!isFriend == true){
                throw new Error('already_friend');
            }

            // get contact's id
            const user = await User.findOne({ username }, "_id, username");

            const [ update_friend_in_user, update_friend_in_contact] = await Promise.all([
                // Delete request from user's profile
                User.updateOne({ _id: ObjectId(auth._id) }, {
                    $pull: { friend_requests_in: ObjectId(user._id) }
                }),

                // Delete request from contact's profile
                User.updateOne({ _id: ObjectId(user._id) }, {
                    $pull: { friend_requests_out: ObjectId(auth._id) }
                })
            ]);


            res.status(201).json({
                status: 'okay',
                msg: 'Request rejected'
            });

        }catch(error){
            switch(error.message){   
                case 'already_friend':
                    res.status(200).json({
                        status: 'okay',
                        msg: 'You both are already friends.',
                        code: 'already_friend'
                    });
                    break;
                case 'request_not_found':
                    res.status(404).json({
                        status: 'okay',
                        msg: 'Request not found',
                        code: 'request_not_found'
                    });
                    break;
                default:
                    res.status(500).json({
                        code: 'error',
                        status: 'error',
                        msg: error.message
                    });
            }
        }
    }
    // End rejectRequest();


    /**
     * Get Friends List
     */
    async getFriendsList (req, res){
        const clog = req.app.crlog;
        clog("rejectRequest() called");

        const auth = req.auth.user;

        try{

            const list = await User.findOne({ _id: auth._id }, "_id")
            .populate('friends', '_id display_name')
            .lean().exec();

            if(list.friends.length > 0){
                res.status(200).json({
                    status: 'okay',
                    msg: 'Friends list',
                    data: list.friends
                });
            }else{
                res.status(404).json({
                    status: "okay",
                    msg: "Data not found."
                });
            }

        }catch(error){
            switch(error.message){                
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