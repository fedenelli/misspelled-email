"use strict";

const validator = require('validator');

const desmantle = (email) => {
    return new Promise((resolve, reject) => {
        if (validator.isEmail(email)) {
            email = email.split("@");
            resolve({ success: true, data: { user: email[0], domain: email[1] } });
        } else {
            reject({ success: false, data: { message: "String provided is not an email "} });
        }
    });
};

module.exports = desmantle;