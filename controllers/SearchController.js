const User = require('../models/userModel');
const paginate = require('express-paginate');

class SearchController{
    constructor(){}

    async user(req, res){
        const clog = req.app.crlog;
        clog('users search called');
        let { q } = req.query;
        let where = {
            $or: [
                { uin: { $regex: `.*${q}.*` } },
                { email: { $regex: `.*${q}.*` } },
                { username: { $regex: `.*${q}.*` } },
                { display_name: { $regex: `.*${q}.*` } }
            ]
        };
        let select = ["username", "email", "display_name", "first_name", "last_name", "dp"];

        try {
            const [ count, results ] = await Promise.all([
                User.countDocuments(where),
                User.find(where, select).limit(req.query.limit).skip(req.skip).lean().exec()
            ]);

            const pageCount = Math.ceil(count / req.query.limit);

            if(results.length > 0){
                res.status(200).json({
                    status: 'okay',
                    msg: 'Search results.',
                    data: results,
                    meta:{
                        query: q,
                        items_count: count,
                        pages_count: pageCount,
                        current_page: req.query.page,
                        has_next: paginate.hasNextPages(req)(pageCount)
                    }
                }); 
            }
            else{
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
                        msg: 'Internal Server Error',
                        data: {
                            errMsg: error.message,
                            error
                        }
                    });
            }
        }
    }
}

module.exports = new SearchController();