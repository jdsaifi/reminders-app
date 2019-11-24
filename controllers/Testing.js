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

    async testDate (req, res) {
        const moment = require('moment-timezone');
        const date = moment('2019-11-21T09:00:00.000+00:00');
        const dateIST = moment('2019-11-21').tz('Asia/Kolkata')

        console.log("dateIST: ", dateIST);


        res.status(200).json({
            "date": date,
            "localformat date ": date.format(),
            "localformat date.utc ": date.format('LLLL'),
            "localformat date.IST ": dateIST,
            "localformat ": moment().format(),
            "moment().format('LLLL')": moment().format('LLLL'),
            "utc": moment().utc()
        });
    }
}

// (async () => {
//     const Users = require('../models/users');
        
//         let user = Users.findOne({username: "jdsaifi"});
//         try{
//             console.log(user.getJWT());
//         }catch(e){
//             console.log(e);
//         }
/*
Auth Tokens:
shanno: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzk5M2IxY2M0YzRiMThkNGViYjYzZSIsImlhdCI6MTU3MzYzNDUzN30.aqASzjNn4byKMRRcPuE9LhAiO5Pmv7Usf_eKvUFgkRA
*/
// })();

module.exports = new Testing();