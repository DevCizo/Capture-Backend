const { orderModel, userModel, orderTransactonsModel } = require('../models/');
const { sequelize, message, print, stripe } = require('../../config/');
const Joi = require('joi');

const index = async (req, res, next) => {
    //List of fhe order list
    await orderModel
        .findAndCountAll({
            where: {
                user_id: req.user.id,
                // order_status: 1,
                status: 1
            },
            include: [{
                model: userModel,
                where: { id: sequelize.col('orders.user_id') }
            }]
            //offset: 10,
            //limit: 2
        })
        .then(result => {
            res.status(200).json({ success: true, data: result.rows, message: message.GENERAL_SUCCESS });
        });

    res.status(200).json({ success: true, message: 'order.index' })
}

// Accept order
const acceptOrder = async (req, res, next) => {

    const { job_id, user_id } = req.body;
    // When some one accepts job
    // First check wether it's accepted it or not before.
    // Capture the amount
    // Mark job as ongoing
    // Inform user about his location

    //const io = req.app.get('socketio');
    //io.emit("broad", 'Inform the user and driver as well');

    await orderModel.findOne({
        where: {
            id: job_id,
            order_status: {
                [sequelize.Op.ne]: 1
            }
        }
    }).then(order => {
        if (order) {
            res.status(200).json({ success: false, message: message.JOB_IS_ALREADY_ASSIGNED_TO_SOMEONE_ELSE });
        }
    }).catch(error => {
        res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: error });
    });

    var userInfo = {};
    await userModel.findByPk(user_id).then(user => {
        if (user) {
            userInfo = user.dataValues;
            return user;
        }
    });

    //Charge customer and make order as accepted.
    stripe.charges.create({
        amount: 10000,
        currency: "usd",
        customer: userInfo.stripe_customer_id,
        capture: false,
        description: `Charge for order from ${userInfo.name} and mobile num ${userInfo.mobile}`
    }, function (err, charge) {

        if (err) res.status(500).json({ success: false, err: err, stripe_error_message: err.message, message: message.GENERAL_ERROR });

        if (charge) {
            orderTransactonsModel.create({
                order_id: job_id,
                transaction_id: charge.id,
                card_source: charge.source.id,
                amount: charge.amount,
                is_captured: 0,
                status: 1,
                created_at: new Date()
            });

            orderModel.update({
                order_status: 2,
                accepted_at: new Date(),
                photographer_id: req.user.id
            }, {
                where: { id: job_id }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });
}

const startOrderSession = async (req, res, next) => {

    const { job_id } = req.body;

    var today = new Date();
    today.setHours(today.getHours() + 1);

    await orderModel.update({
        order_status: 3,
        start_time: new Date(),
        end_time: today
    }, {
            where: {
                id: job_id
            }
        }).then(() => {
            res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
        })
        .catch(function (err) {
            res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
        });
}

// Review of user from photo
const reviewOfUserFromPhoto = async (req, res, next) => {

    const { job_id, ratings, comments } = req.body;

    await Joi.validate({ job_id: job_id, ratings: ratings },
        {
            job_id: Joi.string().required(),
            ratings: Joi.string().required()
        }, function (err, value) {
            if (err) {
                res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
            } else {

                orderModel.update({
                    order_status: 2,
                    user_s_review: comments,
                    users_s_ratings: ratings,
                    photographer_id: req.user.id
                }, {
                        where: {
                            id: job_id
                        }
                    }).then(() => {
                        stripe.charges.capture('ch_1DdCKOLaZm2DgDk6py17ZoXh', function (err, charge) {
                            console.log(err);
                        });
                        res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                    })
                    .catch(function (err) {
                        res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                    });
            }
        });

}

const reviewOfPhotoFromUser = async (req, res, next) => {


}
// Exports module
module.exports = {
    index,
    acceptOrder,
    startOrderSession,
    reviewOfUserFromPhoto,
    reviewOfPhotoFromUser
}