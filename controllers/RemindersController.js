const User = require('../models/userModel');
const Reminder = require('../models/remindersModel');
const paginate = require('express-paginate');
const { check, validationResult, param } = require('express-validator');
const { scheduleTime } = require('../helper/utils');
const moment = require('moment');
// console.log(scheduleTime('2019-11-15', '22:30'));


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
            
            // const friendsList = await User.find({
            //     username: { $in: friends }
            // }, ["username", "display_name"]);
            
            // const friendsIdList = friendsList.map(friend => friend._id);

            // let _dateTime = scheduleTime(body.date, body.time)

            let datetime = moment(`${body.date} ${body.time}`);
            
            let remindMe = new Reminder({
                remind_me: body.remind_me,
                date: body.date,
                time: body.time,
                owner: req.auth.user._id,
                friend: friend,
                remind_on: datetime,
                remind_on_unix: datetime.unix()
            });
            
            let savedReminder = await remindMe.save();
            
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
        // clog("reminders() called");

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

// (async () => {
//     let reminder = await Reminder.findOne({_id: '5dced206f7cd0d46f02d7ddb'});
//     console.log(reminder);
//     console.log("");

//     const moment = require('moment-timezone');
//     console.log(moment(reminder.remind_on))
//     console.log(moment.unix(reminder.remind_on_unix).format())
//     console.log('-----');
//     console.log(moment.tz(reminder.remind_on, 'Europe/London'))
    

// })();

module.exports = new RemindersController();