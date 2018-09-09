"use strict";

const desmantle = (email) => {
    return new Promise((resolve, reject) => {
        if (email.indexOf('@') != -1 && email.indexOf('.') != -1) {
            email = email.split("@");
            resolve({ success: true, data: { user: email[0], domain: email[1] } });
        } else {
            reject({ success: false, data: { message: "String provided is not an email "} });
        }
    });
};

module.exports = desmantle;