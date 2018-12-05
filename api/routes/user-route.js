const { router } = require('../../config/');
const userController = require('../controllers/users-controller');
const authMiddleware = require('../middleware/auth');

router.get('/list', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.index(req,res, next); 
});

router.post('/login', (req, res, next) => { userController.login(req,res, next); });
// Sign-up route
router.post('/sign-up',(req, res, next) => {  userController.signUp(req,res, next); });

// File-upload-demo
router.get('/me', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.userMe(req,res, next);
});

// File-upload-demo
router.post('/update-user-avatar', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.uploadProfilePic(req,res, next);
});

router.post('/update-user-name', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.updateUsername(req,res, next);
});

router.post('/update-user-notification-settings', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.updateUserNotificationSettings(req,res, next);
});

router.post('/update-user-mobile-number', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.updateUserMobileNumber(req,res, next);
});

router.post('/send-otp-to-change-mobilenumber', (req, res, next) => {
    //authMiddleware.auth(req, res, next);
    userController.sendOtpToChangeMobile(req,res, next);
});

router.post('/verify-user', (req, res, next) => {
    userController.verifyUser(req,res, next);
});

router.post('/save-card', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.saveCardOfUser(req,res, next);
});

router.post('/make-default-card', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    userController.makeCardDefaultUser(req,res, next);
});

router.get('/test-charge', (req, res, next) => {
    //authMiddleware.auth(req, res, next);
    userController.testCharge(req,res, next);
});

module.exports = router;