const { router } = require('../../config/');
const photographerController = require('../controllers/photographer-controller');
const authMiddleware = require('../../api/middleware/auth');

// Login route
router.post('/photographer-login', (req, res, next) => { photographerController.login(req,res, next); });
// Sign-up route
router.post('/photographer-sign-up',(req, res, next) => {  photographerController.signUp(req,res, next); });

router.post('/photographer-veryfy-mobile', (req, res, next) => {
    photographerController.verifyUser(req, res, next);
});

//Update profile pic
router.post('/update-photographer-avatar', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.uploadProfilePic(req,res, next);
});

router.post('/update-photographer-name', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updateUsername(req,res, next);
});

router.post('/update-photographer-notification-settings', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updateUserNotificationSettings(req,res, next);
});

router.post('/update-photographer-mobile-number', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updateUserMobileNumber(req,res, next);
});

router.post('/update-photographer-aboutme', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updateAbouteme(req,res, next);
});

router.post('/update-photographer-equipment', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updatePhotoequipment(req,res, next);
});

router.post('/update-photographer-portfolio-link', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updatePortfolioLink(req,res, next);
});

router.post('/update-photographer-online-status', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updateOnlineStatus(req,res, next);
});

router.post('/update-photographer-location', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updateLocation(req,res, next);
});

router.post('/update-paymenet-details', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updatePaymentDetails(req,res, next);
});

router.post('/photographer-save-cards', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.saveCards(req,res, next);
});

router.post('/photographer-delete-cards', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.deleteCards(req,res, next);
});

// Photographer password.
router.post('/photographer-update-password', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    photographerController.updatePassword(req,res, next);
});

module.exports = router;