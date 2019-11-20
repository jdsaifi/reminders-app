// Init Express
const express = require('express');
const router = express.Router();


// Controllers
const TestingCtrl = require('../controllers/Testing');
const UsersController = require('../controllers/UsersController');
const SearchController = require('../controllers/SearchController');
const RemindersController = require('../controllers/RemindersController');
const FriendsController = require('../controllers/FriendsController');

router.get('/test', (req, res) => {
    res.status(200).json({status: 'okay'});
});


/** Route - Signin */
router.post('/api/v1/social-signin', UsersController.validations.socialSignIn, UsersController.socialSignIn);
// End Signin

/** Route - Users */
router.get('/api/v1/authorize', UsersController.authorize);
router.get('/api/v1/users/:username', UsersController.validations.profile, UsersController.profile);
// End Users

/** Route - Search */
router.get('/api/v1/search', SearchController.user);
// End Search

/** Route - Reminders */
// All Reminders
router.route('/api/v1/reminders')
    .get(RemindersController.reminders)
    .post(RemindersController.validations.setReminder, RemindersController.setReminder)

// All Expired Reminders
router.route('/api/v1/expired-reminders')
    .get(RemindersController.expiredReminders)
    
// End Reminders

/** Route - Friends */
router.route('/api/v1/friends/request')
    .post(FriendsController.sendRequest)
// End Friends



/** Route - testing */
router.get('/test/get-auth-token/:username', TestingCtrl.getAuthToken);
router.get('/test/date', TestingCtrl.testDate);
// End testing




module.exports = router;