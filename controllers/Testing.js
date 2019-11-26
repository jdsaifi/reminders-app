const User = require('../models/userModel');

class Testing {
    constructor(){}

    async getAuthToken (req, res){
        let dlog = req.app.dlog;
        let { username } = req.params;
        
        try{
            let user = await User.findOne({username});
            let token = await user.getJWT();

            res
            .status(200)
            .json({
                id: user._id,
                username: user.username,
                access_token: token
            })
        }catch(e){
            dlog(e);
        }
    }
}

// let date = new Date('2019-11-27 15:00');


// console.log("date direct: ", date);
// console.log("Date to ISO: ", date.toISOString());
// console.log("----", date.toString());
// console.log("utc", date.valueOf());
// console.log('');
// console.log('');
// console.log('');

// const mtz = require('moment-timezone');
// let tDate = '2019-11-27 20:30';
// let mDate = mtz(date);

// console.log(mtz(date).utc())
// console.log('new date.utc', Date.UTC(2019,11,27,15,0))
// console.log({
//     year: date.getFullYear(),
//     month: date.getMonth()+1,
//     day: date.getDate(),
//     hour: date.getHours(),
//     minutes: date.getMinutes()
// });
// console.log({
//     year: mDate.format('YYYY'),
//     month: mDate.format('MM'),
//     day: mDate.format('DD'),
//     hour: mDate.format('HH'),
//     minutes: mDate.format('mm')
// });

// let unixUTCTime = Date.UTC(
//     mDate.format('YYYY'), 
//     mDate.format('MM'), 
//     mDate.format('DD'), 
//     mDate.format('HH'), 
//     mDate.format('mm')
// );

// console.log('unix UTC Time: ', unixUTCTime);
// console.log('unix UTC Time to Date: ', mtz(unixUTCTime).format('LLLL'));
// console.log('UTC to local unix: ', mtz(unixUTCTime).unix());
// console.log('')
// console.log('')
// console.log('')
// console.log('')
// /*
//     notes:
//     if target date in India is: 2019-11-27 20:30 (8:30 PM)
//     then what time it will be in UTC: ?
// */
// console.log("target date (IST): ", tDate)
// console.log("converted IST to UTC: ", mtz(tDate).utc().format('YYYY-MM-DDTHH:mm'));
// console.log("converted IST to UTC to UNIX: ", mtz(tDate).utc().unix());

// console.log('')
// console.log('')

// let dateNY = mtz.tz(tDate, "America/New_York");
// console.log("target date (NYT): ", dateNY.format('YYYY-MM-DDTHH:mm'))
// console.log("converted NYT to UTC: ", dateNY.utc().format('YYYY-MM-DDTHH:mm'))
// console.log("converted NYT to UTC to UNIX: ", dateNY.utc().unix())

// console.log('')
// console.log('')

// console.log("timezone", mtz.tz.zone())

module.exports = new Testing();