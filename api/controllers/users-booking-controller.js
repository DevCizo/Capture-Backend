const Joi = require('joi');
const { orderModel, userModel, orderTransactonsModel } = require('../models/');
const { message, sequelize, print, stripe } = require('../../config/');

const index = (req, res, next) => {

    const { lat, longi } = req.body;
    Joi.validate({ lat: lat, longi: longi }, { longi: Joi.string().required(), lat: Joi.string().required(), }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            // To search by kilometers instead of miles, replace 3959 with 6371.
            sequelize.query('SELECT id, name, lat, longi, ( 6371 * acos(cos(radians(:lat)) * cos(radians(lat)) * cos(radians(longi) - radians(:longi)) + sin(radians(:lat)) * sin(radians(lat))) ) AS distance FROM photographers HAVING distance < :kms ORDER BY distance LIMIT 0, 20',
                { replacements: { lat: lat, longi: longi, kms: 3 }, type: sequelize.QueryTypes.SELECT }
            ).then(projects => {
                print(projects);
                if (projects.length) {
                    res.status(200).json({ success: true, data: projects, message: message.GENERAL_SUCCESS });
                } else {
                    res.status(200).json({ success: false, data: [], message: message.NO_PHOTOGRAPHERS_AVAILABLE })
                }
            });
        }
    });
}

//bookPhotographer
const bookPhotographer = async (req, res, next) => {

    const { lat, longi, address } = req.body;
    var userInfo = {};
    await userModel.findByPk(req.user.id).then(user => {
        if (user) {
            userInfo = user.dataValues;
            return user;
        }
    });

    await Joi.validate({
        lat: lat,
        longi: longi,
        address: address
    },
        {
            longi: Joi.string().required(),
            lat: Joi.string().required(),
            address: Joi.string().required()
        }, function (err, value) {
            if (err) {
                res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
            } else {

                // Order requested.
                //1. Insert into the order table
                //2. Notify to photographer
                //3 Update order status every bit.

                //Check User has card.
                if (!userInfo.has_card || !userInfo.stripe_customer_id) res.status(500).json({ success: false, message: message.CARD_IS_NOT_ADDED });
                
                orderModel.create({
                        user_id: req.user.id,
                        lat: lat,
                        longi: longi,
                        address: address,
                        order_status: 1,
                        status: 1,
                        is_paid: 0,
                        created_at: new Date()
                }).then(newOrder => {
                        res.status(200).json({ success: true, data: newOrder, message: message.GENERAL_SUCCESS });
                }).catch(function (err) {
                        res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
            }

        });
}

module.exports = {
    index,
    bookPhotographer
}