const express = require('express');
const router = express.Router();
const Joi = require('joi');
const stripe =  require("stripe")("sk_test_NmD6Bqjo0rlQXtsfRHuQpfEz");

const randomString = function () {
    return Math.floor((Math.random() * 100000) + 3);
}
const app_version  = 1.0;

const signUpSchema = {
    name: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    mobile: Joi.number().integer().required()
};

const signUpUserSchema = {
    name: Joi.string().min(3).required(),
    mobile: Joi.number().integer().required()
};

const loginSchema = {
    mobile: Joi.number().integer().required()
}

const cardSchema = {
    name: Joi.string().min(3).required(),
    number: Joi.number().integer().required(),
    exp_month: Joi.number().integer().required(),
    exp_year: Joi.number().integer().required(),
    cvc: Joi.number().integer().required()
}

const stripeVerificationSchema = {
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    address: Joi.string().min(3).required(),
    state: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
    postal_code: Joi.number().integer().required(),
    dob: Joi.string().min(3).required(),
    personal_id_number: Joi.string().min(9).required()
}

const print = function (data) {
    console.log('--*----*-------*--------*--------*------*------*----------*------*-------*----');
    console.log(data);
    console.log('--*-----*------*--------*--------*-----*-------*----------*-------*------*----');
}

// const getUserinfo = async function (id){

//     await userModel.findByPk(id).then(user => {
//         if (user) {
//             return user;
//         }
//     });

// }

module.exports = {
    randomString: randomString,
    //getUserinfo,
    router: router,
    secret: 'join_capture_2018',
    signUpSchema: signUpSchema,
    loginSchema: loginSchema,
    print,
    stripe,
    cardSchema,
    app_version,
    signUpUserSchema,
    stripeVerificationSchema
}