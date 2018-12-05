const Joi = require('joi');
const md5 = require('md5');
const { userModel, orderModel, photographerModel, userCardModel } = require('../models/');
const { message, twillo, randomString, loginSchema, signUpUserSchema, jwt, secret, print, stripe, cardSchema, sequelize, Sequelize } = require('../../config/');
const authMiddleware = require('../../api/middleware/auth');

const index = (req, res, next) => {

    authMiddleware.auth(req, res);
    // ---------- EMAIL SEND CODE ----
    // const msg = {
    //     to: 'jignesh@cizotech.com',
    //     from: 'no-replay@capture.com',
    //     subject: 'Capture: Welcome',
    //    // text: 'and easy to do anywhere, even with Node.js',
    //     html: welcomeTemplate('password'),
    // };
    // emailConfig.send(msg);

    // -------- TWILLO CLIENT MESSAGE -----
    // twillo.messages
    // .create({
    //     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    //     from: '+18628002182',
    //     to: '+919714236236'
    // })
    // .then(message => console.log(message))
    // .done();

    userModel.findAll({
        attributes: ['id', 'name', 'email', 'mobile', 'is_verified']
    }).then(user => {
        res.status(200).json({ success: true, data: user, message: message.GENERAL_SUCCESS });
    });
}

// Login user.
const login = (req, res, next) => {

    const { mobile } = req.body;

    Joi.validate({ mobile: mobile }, loginSchema, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            userModel.findOne({
                attributes: ['id', 'name', 'email', 'mobile', 'is_verified', 'rating', 'total_orders', 'is_push_on', 'stripe_customer_id']
                , where: { mobile: mobile }
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

const signUp = async (req, res, next) => {

    const { name, mobile, device_token } = req.body;

    Joi.validate({ name: name, mobile: mobile }, signUpUserSchema, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            userModel.create({
                name: name,
                device_token: device_token,
                //password: md5(password),
                mobile: mobile,
                sms_code: randomString(),
                status: 1,
                created_at: new Date()
            }).then(newUser => {
                var token = jwt.sign({ id: newUser.id }, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                if (newUser._options.isNewRecord) {
                    stripe.customers.create({
                        description: `Customer for ${mobile} and ${name}`,
                        //source: "tok_mastercard" // obtained with Stripe.js
                    }, function (err, customer) {
                        userModel.update({ stripe_customer_id: customer.id }, {
                            where: { id: newUser.id }
                        });
                    });
                }
                res.status(200).json({ success: true, token: token, data: newUser, message: message.GENERAL_SUCCESS });
            }).catch(function (err) {
                // print the error details
                if (err.name === 'SequelizeUniqueConstraintError') {
                    res.status(200).json({ success: false, data: [], is_exist: 1, message: message.MOBILE_IS_ALREADY_EXIST });
                } else {
                    res.status(500).json({ success: false, data: [], message: message.GENERAL_ERROR, error: err });
                }
            });
        }
    });
}

const verifyUser = async (req, res, next) => {

    const { id } = req.body;

    userModel.update({
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

//userMe
const userMe = async (req, res, next) => {
    // User model.

    let returnData = {};
    await userModel.findByPk(req.user.id).then(user => {
        if (user) {
            returnData.user = user;
        }
    });

    await orderModel.findAll({
        where: {
            user_id: req.user.id,
            status: {
                [sequelize.Op.notIn]: [5, 6]
            }
        },
        include: [
            { model: userModel, where: { id: req.user.id } },
            { model: photographerModel }
        ]
    }).then(data => {
        returnData.orders = data;
    }).catch(err => {
        console.log(err);
    });

    res.status(200).json({ success: true, data: returnData });
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

            userModel.update({
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

    userModel.update({
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

const updateUserNotificationSettings = (req, res, next) => {
    const { flag } = req.body;
    userModel.update({
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
    userModel.update({
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

const sendOtpToChangeMobile = (req, res, next) => {

    const randomNum = randomString();
    const { mobile } = req.body;
    twillo.messages
        .create({
            body: `Capture: Hi there! Your one time password is ${randomNum}`,
            from: '+18628002182',
            to: mobile
        })
        .then(message => {
            console.log(message);
            res.status(200).json({ success: true, message: message.GENERAL_SUCCESS, detail: message, otp: randomNum }).end();
        }).catch(err => {
            res.status(200).json({ success: false, message: err.message, detail: err }).end();
        })
        .done();
}

const saveCardOfUser = async (req, res, next) => {

    const { name, number, exp_month, exp_year, cvc, stripe_customer_id, is_default } = req.body;
    await Joi.validate({ name: name, number: number, exp_month: exp_month, exp_year: exp_year, cvc: cvc }, cardSchema, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            // stripe tokens
            stripe.tokens.create({
                card: {
                    "number": number,
                    "exp_month": exp_month,
                    "exp_year": exp_year,
                    "cvc": cvc,
                    'name': name
                }
            }, function (err, token) {

                if (token) {
                    const { id, brand, last4 } = token.card;

                    stripe.customers.createSource(
                        stripe_customer_id,
                        { source: token.id },
                        function (err, card) {
                            
                            if(err) res.status(500).json({ success: false, stripe_error_message: err.message , message: message.GENERAL_ERROR, error: err });

                            if (card) {
                                
                                userCardModel.create({
                                    user_id: req.user.id,
                                    name: name,
                                    last_four: last4,
                                    card_token: id,
                                    is_default: is_default,
                                    brand: brand,
                                    status: 1,
                                    created_at: new Date()
                                });

                                // update user have card.
                                userModel.update(
                                        { has_card: 1 },
                                        { where: { id: req.user.id } }
                                   ).then(function() {
                                       console.log("Project with id =1 updated successfully!");
                                   }).error(function(err) {
                                       console.log("Project update failed !");
                                });
                                res.status(200).json({ success: true, message: message.CARD_ADDED_SUCCESS });
                            }
                        }
                    );
                } else {
                    res.status(500).json({ success: false, message: message.GENERAL_ERROR, error: err })
                }
            });
        }
    });
}

// Make card default
const makeCardDefaultUser = async (req, res, next) => {

    const { card_token, stripe_customer_id } = req.body;

    await Joi.validate({ card_token: card_token, stripe_customer_id: stripe_customer_id }, { card_token: Joi.string().min(3).required(), stripe_customer_id: Joi.string().min(3).required() }, function (err, value) {
        if (err) {
            res.status(200).json({ success: false, data: [], message: message.INVALID_PARAMS, details: err.details });
        } else {
            stripe.customers.update(stripe_customer_id, {
                default_source: card_token
            }, function (err, customer) {
                if (err) {
                    res.status(500).json({ success: false, message: message.GENERAL_ERROR, err: err })
                }
                if (customer) {
                    res.status(200).json({ success: true });
                }
            });
        }
    });
}

// Test charge
const testCharge = async (req, res, next) => {
    
    //@ To allocate amount into the photographer's account.
    // stripe.transfers.create({
    //     amount: 400,
    //     currency: "usd",
    //     destination: "acct_1DcpaqGuu8AvHTsG",
    // }, function(err, transfer) {
    //     // asynchronously called
    //     console.log(err);
    //     res.status(200).json({data: transfer});
    //     console.log(transfer);
    // });

    //@To transfer funds to card
    // stripe.payouts.create({
    //     amount: 10,
    //     currency: "usd",
    //   }, {
    //     stripe_account: "acct_1DcpaqGuu8AvHTsG",
    //   }).then(function(payout) {
    //     // asynchronously called
    //     console.log(payout);
    //   });

    //@ To refund the amoun to customer.
    // stripe.refunds.create({
    //     charge: "ch_1DdC8VLaZm2DgDk6Mn1uwVHG"
    //   }, function(err, refund) {
    //     // asynchronously called
    // });

    //@To retrive the balance
    stripe.balance.retrieve({
        stripe_account: 'acct_1DcpaqGuu8AvHTsG'
      }, function(err, balance) {
          console.log(balance);
          res.status(200).json({ data: balance });
        // asynchronously called
    });

    //@Update payout schedule.
    // stripe.accounts.update("acct_1DcpaqGuu8AvHTsG", {
    //     payout_schedule: { interval: 'manual'}
    // }, function(err){
    //     console.log(err);
    // });

    //@ To retrive account details.
    // stripe.accounts.retrieve(
    //     "acct_1DcpaqGuu8AvHTsG",
    //     function(err, account) {
    //       // asynchronously called
    //       res.status(200).json({ data: account });
    //     }
    // );


    // stripe.accounts.deleteExternalAccount(
    //     "acct_1DcpaqGuu8AvHTsG",
    //     "card_1Dcr5VGuu8AvHTsG7fNz5GPF",
    //     function(err, confirmation) {
    //       // asynchronously called
    //       console.log(err);
    //       console.log(confirmation);
    //     }
    //   );
    
    //@ To update default external account.
    // stripe.accounts.updateExternalAccount(
    //     "acct_1DcpaqGuu8AvHTsG",
    //     "card_1Dcr7MGuu8AvHTsGkaqIcrp7",
    //     { default_for_currency: true },
    //     function(err, card) {
    //       // asynchronously called
    //       console.log(err);
    //       console.log(card);
    //     }
    // );

    //@To create a charge to customer.
    // stripe.charges.create({
    //     amount: 9000,
    //     currency: "usd",
    //     customer: 'cus_E4Cl41V0iWu9qS',
    //     capture: false,
    //     //source: "tok_amex", // obtained with Stripe.js
    //     description: "Charge for jenny.rosen@example.com"
    // }, function(err, charge) {
    //     console.log(err);
    //     if(err){
    //         res.status(500).json({err: err});
    //     }
    //     if(charge){
    //         res.status(200).json({data: charge });
    //     }
    //     console.log(charge); 
    //     // asynchronously called
    // });

    //ch_1DcSx4LaZm2DgDk6RHF7MjPm
    // stripe.charges.capture('ch_1DcSx4LaZm2DgDk6RHF7MjPm', function (err, charge) {
    //     // asynchronously called
    //     if (err) {
    //         res.status(500).json({ err: err });
    //     }
    //     if (charge) {
    //         res.status(200).json({ data: charge });
    //     }
    // });

    // stripe.topups.create({
    //     amount: 2000,
    //     currency: 'usd',
    //     description: 'Top-up for Jenny Rosen',
    //     statement_descriptor: 'Stripe top-up'
    // }, function (err, topup) {
    //     // asynchronously called
    //     if (err) {
    //         res.status(500).json({ err: err });
    //     }
    //     if (topup) {
    //         res.status(200).json({ data: topup });
    //     }
    // });
}

module.exports = {
    index,
    signUp,
    uploadProfilePic,
    login,
    updateUsername,
    updateUserNotificationSettings,
    sendOtpToChangeMobile,
    updateUserMobileNumber,
    userMe,
    saveCardOfUser,
    verifyUser,
    makeCardDefaultUser,
    testCharge
}