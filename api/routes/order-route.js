const { router } = require('../../config/');
const authMiddleware = require('../middleware/auth');
const usersOrderController = require('../controllers/users-orders-controller');

router.get('/order-list', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    usersOrderController.index(req, res, next);
});

router.post('/accept-order', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    usersOrderController.acceptOrder(req, res, next);
});

router.post('/start-order-session', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    usersOrderController.startOrderSession(req, res, next);
});

router.post('/end-order-session', (req, res, next) => {

    // We have inform the user.
    // Show the give rating screen.  
});

// Collect review of user from photographer
router.post('/give-review-of-user-from-photographer',(req, res, next) => {
    authMiddleware.auth(req, res, next);
    usersOrderController.reviewOfUserFromPhoto(req, res, next);
});

// Collect reiview from user
router.post('/give-review-of-photographer-from-user',(req, res, next) => {
    authMiddleware.auth(req, res, next);
    usersOrderController.reviewOfPhotoFromUser(req, res, next);
});

module.exports = router;