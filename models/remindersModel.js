const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const remindersSchema = mongoose.Schema({
    remind_me:{
        type: String,
        required: true
    },
    // desc: {
    //     type: String,
    //     default: null
    // },
    owner: {
        type: ObjectId,
        ref: "users"
    },
    friend: {
        type: ObjectId,
        ref: "users"
    },
    // freq_type: {
    //     type: String,
    //     enum: ['once', 'daily', 'weekly', 'monthly'],
    //     default: 'once'
    // },
    // interval: {
    //     type: String,
    //     default: '0'
    //     /*
    //     If type = 'Once' then value = 0 (no interval) schedule would execute on reminder_date and reminder_time
    //     If type = 'Daily' then value = # of days interval
    //     If type = 'Weekly' then 1 through 7 for day of the week, weekdays, weekends
    //     If type = 'Monthly' then 1 through 31 for day of the month, firstDay, lastDay
    //     */
    // },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    remind_on: {
        type: Date,
        required: true
    },
    remind_on_unix: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Reminders = mongoose.model('reminders', remindersSchema);

module.exports = Reminders;