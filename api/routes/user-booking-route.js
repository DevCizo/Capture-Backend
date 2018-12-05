const { router } = require('../../config/');
const authMiddleware = require('../middleware/auth');
const usersBookingController = require('../controllers/users-booking-controller');

router.post('/get-nearby', (req, res, next) => {
    //authMiddleware.auth(req, res, next);
    usersBookingController.index(req,res, next); 
});

router.post('/book-photographer', (req, res, next) => {
    authMiddleware.auth(req, res, next);
    usersBookingController.bookPhotographer(req,res, next); 
});

module.exports = router;