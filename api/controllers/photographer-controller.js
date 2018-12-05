const Joi = require('joi');
const md5 = require('md5');
const { photographerModel, photographerStripeModel, photographerCardsModel } = require('../models/');
const { message, jwt, loginSchema, signUpSchema, secret, stripe, randomString, print, stripeVerificationSchema, cardSchema } = require('../../config/');

// Login user.
const login = (req, res, next) => {

    const { mobile } = req.body;

    Joi.validate({ mobile: mobile }, loginSchema, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.findOne({
                //attributes: ['id', 'name', 'email', 'mobile', 'is_verified', ''],
                where: { mobile: mobile, is_verified: '1' }
            })
                .then(loggedInUser => {
                    if (loggedInUser) {
                        var token = jwt.sign({ id: loggedInUser.id }, secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).json({ success: true, token: token, data: loggedInUser, message: message.GENERAL_SUCCESS });
                    } else {
                        res.status(200).json({ success: false, token: '', data: [], message: message.NOT_REGISTRED_WITH_US });
                    }
                });
        }
    });

}

const signUp = (req, res, next) => {

    const { mobile } = req.body;

    Joi.validate({ mobile: mobile }, { mobile: Joi.number().integer().required() }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.create({
                // name: name,
                // email: email,
                // password: md5(password),
                mobile: mobile,
                sms_code: randomString(),
                created_at: new Date()
            }).then(newUser => {

                var token = jwt.sign({ id: newUser.id }, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).json({ success: true, token: token, data: newUser, message: message.GENERAL_SUCCESS });
            }).catch(function (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    if (err.fields.mobile) {
                        res.status(200).json({ success: false, data: [], is_exist: 1, message: message.MOBILE_IS_ALREADY_EXIST });
                    } else {
                        res.status(200).json({ success: false, data: [], message: message.EMAIL_IS_ALREADY_EXIST });
                    }
                } else {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                }
            });
        }
    });
}

const verifyUser = async (req, res, next) => {

    const { id } = req.body;

    photographerModel.update({
        is_verified: 1,
    }, {
            where: {
                id: id
            }
        }).then(() => {
            res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
        })
        .catch(function (err) {
            res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
        });
}

const uploadProfilePic = (req, res, next) => {
    if (req.files.avatar) {
        var file = req.files.avatar,
            name = file.name,
            type = file.mimetype;
        fileName = Date.now() + name;
        var uploadpath = 'public/avatars/' + fileName;
        file.mv(uploadpath, function (err) {
            if (err) res.status(200).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });

            photographerModel.update({
                profile_pic: fileName,
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        });
    }
    else {
        res.status(500).json({ success: false, data: [], message: message.INVALID_PARAMS });
    };
}

const updateUsername = (req, res, next) => {
    const { name } = req.body;

    Joi.validate({ name: name, }, { name: Joi.string().min(3).required() }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                name: name,
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });

}

const updateUserNotificationSettings = (req, res, next) => {
    const { flag } = req.body;
    photographerModel.update({
        is_push_on: flag, //1 or 0
    }, {
            where: {
                id: req.user.id
            }
        }).then(() => {
            res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
        })
        .catch(function (err) {
            res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
        });
}

//updateUserMobileNumber
const updateUserMobileNumber = (req, res, next) => {
    const { mobile } = req.body;
    Joi.validate({ mobile: mobile, }, { mobile: Joi.number().integer().required() }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                mobile: mobile,
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });

}

//updateUserMobileNumber
const updateAbouteme = (req, res, next) => {
    const { about_me } = req.body;
    Joi.validate({ about_me: about_me, }, { about_me: Joi.string().min(10).required(), }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                about_me: about_me,
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });

}

//updatePhotoequipment
const updatePhotoequipment = (req, res, next) => {
    const { photo_equipment } = req.body;
    Joi.validate({ photo_equipment: photo_equipment, }, { photo_equipment: Joi.string().min(3).required(), }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                photo_equipment: photo_equipment,
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });

}

//updateUserMobileNumber
const updatePortfolioLink = (req, res, next) => {
    const { portfolio_link } = req.body;
    Joi.validate({ portfolio_link: portfolio_link, }, { portfolio_link: Joi.string().min(10).required(), }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                portfolio_link: portfolio_link,
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });
}

//updateOnlineStatus
const updateOnlineStatus = (req, res, next) => {
    const { is_online } = req.body;
    Joi.validate({ is_online: is_online, }, { is_online: Joi.string().required(), }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                is_online: is_online,
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });
}


const updatePassword = (req, res, next) => {

    const { password } = req.body;
    Joi.validate({ password: password, }, { password: Joi.string().min(6).required(), }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                password: md5(password),
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });

}


const updateLocation = (req, res, next) => {
    const { lat, longi } = req.body;
    Joi.validate({ lat: lat, longi: longi }, { longi: Joi.string().required(), lat: Joi.string().required(), }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            photographerModel.update({
                lat: lat,
                longi: longi
            }, {
                    where: {
                        id: req.user.id
                    }
                }).then(() => {
                    res.status(200).json({ success: true, data: [], message: message.GENERAL_SUCCESS });
                })
                .catch(function (err) {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });
        }
    });
}

// update payment details
const updatePaymentDetails = async (req, res, next) => {

    const { first_name, last_name, email, address, city, state, postal_code, dob, document, personal_id_number } = req.body;

    await Joi.validate({
        first_name: first_name,
        last_name: last_name,
        email: email,
        address: address,
        city: city,
        state: state,
        postal_code: postal_code,
        personal_id_number: personal_id_number,
        dob: dob
    },
        stripeVerificationSchema,
        function (err, value) {
            if (err) {
                res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
            } else {
                const dateOfBirth = dob.split("-");

                var file = req.files.document,
                    name = file.name,
                    type = file.mimetype;
                fileName = Date.now() + '.png';
                var uploadpath = 'public/documents/' + fileName;
                file.mv(uploadpath, function (err) {
                    if (err) res.status(200).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                });

                stripe.accounts.create({
                    type: 'custom',
                    country: 'US',
                    email: email,
                    legal_entity: {
                        personal_address: {
                            "city": city,
                            "country": "US",
                            "line1": address,
                            "line2": "",
                            "postal_code": postal_code,
                            "state": state
                        },
                        address: {
                            "city": city,
                            "country": "US",
                            "line1": address,
                            "line2": "",
                            "postal_code": postal_code,
                            "state": state
                        },
                        type: 'individual',
                        //ssn_last_4: '2345',
                        personal_id_number: personal_id_number,
                        dob: {
                            "day": dateOfBirth[0],
                            "month": dateOfBirth[1],
                            "year": dateOfBirth[2]
                        },
                        first_name: first_name,
                        last_name: last_name
                    },
                    tos_acceptance: {
                        date: Math.floor(Date.now() / 1000),
                        ip: req.connection.remoteAddress // Assumes you're not using a proxy
                    }
                }, function (err, account) {
                    // asynchronously called
                    if (err) res.status(500).json({ success: false, message: message.GENERAL_ERROR });

                    if (account) {
                        photographerStripeModel.create({
                            photographer_id: req.user.id,
                            first_name: first_name,
                            last_name: last_name,
                            email: email,
                            dob: dob,
                            address: address,
                            state: state,
                            city: city,
                            postal_code: postal_code,
                            document: fileName,
                            stripe_customer_id: account.id,
                            personal_identity_number: '',
                            status: 1,
                            created_at: new Date()
                        }).then(stripeDetails => {
                            res.status(200).json({ success: true, data: stripeDetails, message: message.GENERAL_SUCCESS });
                        }).catch(function (err) {
                            print(err);
                            res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                        });
                    }
                });
            }
        });
    res.status(200);
}

const saveCards = async (req, res, next) => {

    const { name, number, exp_month, exp_year, cvc, stripe_customer_id, is_default } = req.body;

    await Joi.validate({ name: name, number: number, exp_month: exp_month, exp_year: exp_year, cvc: cvc }, cardSchema, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {

            stripe.tokens.create({
                card: {
                    "number": number,
                    "exp_month": exp_month,
                    "exp_year": exp_year,
                    "cvc": cvc,
                    "currency": "usd",
                    'name': name
                }
            }, function (err, token) {

                if (err) res.status(500).json({ success: false, err: err, message: message.GENERAL_ERROR });

                if (token) {

                    const { id, brand, last4 } = token.card;
                    stripe.accounts.createExternalAccount(
                        stripe_customer_id,
                        { external_account: token.id },
                        function (err, account) {
                            if (err) {
                                if (err.code === 'invalid_card_type') {
                                    res.status(500).json({ success: false, err: err, message: message.GENERAL_ERROR, stripe_error_message: err.raw.message });
                                } else {
                                    res.status(500).json({ success: false, err: err, message: message.GENERAL_ERROR });
                                }
                            }

                            if (account) {
                                photographerCardsModel.create({
                                    photographer_id: req.user.id,
                                    name: name,
                                    last_four: account.last4,
                                    card_token: account.id,
                                    is_default: is_default,
                                    brand: brand,
                                    status: 1,
                                    created_at: new Date()
                                });
                                res.status(200).json({ success: true, data: [], message: message.CARD_ADDED_SUCCESS });
                            }
                        });
                }
            });
        }
    });
}

// Delete cards
const deleteCards = async (req, res, next) => {

    const { card_token, stripe_customer_id } = req.body;

    Joi.validate({ card_token: card_token, stripe_customer_id: stripe_customer_id }, { card_token: Joi.string().required(), stripe_customer_id: Joi.string().required() }, function (err, value) {
        if (err) {
            res.status(500).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            stripe.accounts.deleteExternalAccount(
                stripe_customer_id,
                card_token,
                function (err, confirmation) {
                    // asynchronously called
                    if(err) {
                        res.status(500).json({ success: false, message: message.GENERAL_ERROR, err: err });
                    }

                    if(confirmation){
                        photographerCardsModel.destroy({
                            where: { card_token: card_token }
                        });
                        res.status(200).json({ success: true, message: message.GENERAL_SUCCESS });
                    }
                }
            );
        }
    });
}

module.exports = {
    login,
    signUp,
    verifyUser,
    uploadProfilePic,
    updateUsername,
    updateUserNotificationSettings,
    updateUserMobileNumber,
    updateAbouteme,
    updatePhotoequipment,
    updatePortfolioLink,
    updateOnlineStatus,
    updateLocation,
    updatePaymentDetails,
    saveCards,
    deleteCards,
    updatePassword
}