const User = require('../models/userModel');
const Reminder = require('../models/remindersModel');
const paginate = require('express-paginate');
const { check, validationResult, param } = require('express-validator');
const config = require('../config');
const moment = require('moment');
const _ = require('lodash');

class RemindersController {
    constructor(){
        /** Validations */
        this.validations = {
            setReminder: [
                check('remind_me').not().isEmpty().withMessage('Reminder can not be empty').bail()
                .exists().withMessage('Reminder required'),
                check('date').not().isEmpty().withMessage('Date can not be empty.'),
                check('time').not().isEmpty().withMessage('Time can not be empty.')
            ]
        }
    }

    /**
     * Set reminder
     */
    async setReminder(req, res){
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(config.EMAIL.SENDGRID_API_KEY);
        let clog = req.app.crlog;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                msg: 'Something went wrong.',
                data: errors.array()
            });
        }
        
        // clog('body');
        // clog(req.body);
        const { body } = req;

        try{
            // const friends = (body.friends || '').length > 0 ? body.friends.split(',') : [];
            const friend = body.friend || '';
            const auth = req.auth.user;

            // const friendsList = await User.find({
            //     username: { $in: friends }
            // }, ["username", "display_name"]);
            
            // const friendsIdList = friendsList.map(friend => friend._id);

            // let _dateTime = scheduleTime(body.date, body.time)

            let datetime = moment(`${body.date} ${body.time}`);

            let data = {
                remind_me: body.remind_me,
                date: body.date,
                time: body.time,
                owner: req.auth.user._id,
                remind_on: datetime,
                remind_on_unix: datetime.unix()
            };

            if(friend !== '') data['friend'] = friend;
            
            let remindMe = new Reminder(data);
            
            let savedReminder = await remindMe.save();

            if(savedReminder){
                const ownerDetail = await User.findOne({ _id: auth._id }, '_id username email');
                const friendsDetail = friend === '' ? {} : 
                await User.findOne({ _id: friend }, '_id username email');

                let emailMessage = {
                    to: ownerDetail.email,
                    from: config.EMAIL.NOTIFY_FROM,
                    subject: config.EMAIL.NOTIFY_SUBJECT,
                    text: `Here is your new reminder: ${savedReminder.remind_me}`,
                    html: `Dear ${ownerDetail.username}
                    <p>You have a new reminder</p>
                    <p>Reminder Details: <strong>${savedReminder.remind_me}</strong>`,
                    sendAt: savedReminder.remind_on_unix
                };
                
                // Schedule email for reminder owner
                sgMail.send(emailMessage)
                .then(() => {
                    console.log('[Email Schedule Success] for owner: ', {
                        reminder_id: savedReminder._id
                    });
                })
                .catch(error => {
                    console.log('[Email Schedule Error] for owner: ', {
                        reminder_id: savedReminder._id,
                        error: error.toString()
                    });
                });
                

                if(!_.isEmpty(friendsDetail)){
                    emailMessage = {
                        ...emailMessage,
                        to: friendsDetail.email,
                        html: `Dear ${friendsDetail.username}
                        <p>You have a new reminder</p>
                        <p>Reminder Details: <strong>${savedReminder.remind_me}</strong>`,
                    }

                    // Schedule email for reminder owner
                    sgMail.send(emailMessage)
                    .then(() => {
                        console.log('[Email Schedule Success] for friend: ', {
                            reminder_id: savedReminder._id
                        });
                    })
                    .catch(error => {
                        console.log('[Email Schedule Error] for friend: ', {
                            reminder_id: savedReminder._id,
                            error: error.toString()
                        });
                    });
                }
            
                res.status(201).json({
                    status: 'okay',
                    msg: 'Reminder has been set successfuly.',
                    data: {
                        id: savedReminder._id,
                        remind_me: savedReminder.remind_me,
                        date: savedReminder.date,
                        time: savedReminder.time,
                        remind_on: savedReminder.remind_on,
                        remind_on_unix: savedReminder.remind_on_unix,
                        createdAt: savedReminder.createdAt
                    }
                }); 
            }else{
                res.status(500).json({
                    status: 'error',
                    msg: "Something went wrong."
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
    // End setReminder();

    /**
     * Get reminders list
     */
    async reminders(req, res) {
        const clog = req.app.crlog;
        const { user } = req.auth;
        try{
            let where = {
                $and: [
                    { remind_on: { $gt: moment.utc() } },
                    { 
                        $or: [
                            { owner: user._id },
                            { friend: user._id }
                        ] 
                    }
                ]
            };

            const select = '-__v';
            
            let [ count, remindersList ] = await Promise.all([
                Reminder.countDocuments(where),
                Reminder.find(where, select)
                .populate('friend', '_id display_name')
                .populate('owner', '_id username display_name dp')
                .sort('remind_on')
                .limit(req.query.limit).skip(req.skip).lean().exec()
            ]);

            let results = remindersList;

            const pageCount = Math.ceil(count / req.query.limit);

            if(results.length > 0){
                res.status(200).json({
                    status: 'okay',
                    msg: 'Reminders',
                    data: results,
                    meta:{
                        items_count: count,
                        pages_count: pageCount,
                        current_page: req.query.page,
                        has_next: paginate.hasNextPages(req)(pageCount)
                    }
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
    // End reminders();

    /**
     * Get expired reminders list
     */
    async expiredReminders(req, res) {
        const clog = req.app.crlog;
        // clog("reminders() called");

        const { user } = req.auth;

        try{
            let where = {
                $and: [
                    { remind_on: { $lt: moment.utc() } },
                    { 
                        $or: [
                            { owner: user._id },
                            { friends: { $in: [ user._id ] } }
                        ] 
                    }
                ]
            };

            const select = '-__v';
            
            let [ count, remindersList ] = await Promise.all([
                Reminder.countDocuments(where),
                Reminder.find(where, select)
                .populate('friends', '_id username email display_name first_name last_name createdAt')
                .sort('-remind_on')
                .limit(req.query.limit).skip(req.skip).lean().exec()
            ]);

            let results = remindersList;

            const pageCount = Math.ceil(count / req.query.limit);

            res.status(200).json({
                status: 'okay',
                msg: 'Reminders',
                data: results,
                meta:{
                    items_count: count,
                    pages_count: pageCount,
                    current_page: req.query.page,
                    has_next: paginate.hasNextPages(req)(pageCount)
                }
            });
            
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
    // End expiredReminders();
}

module.exports = new RemindersController();