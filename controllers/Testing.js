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
        const moment = require('moment');

        res.status(200).json({
            "moment().format('YYYY-MM-DD')": moment().format('LLLL'),
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