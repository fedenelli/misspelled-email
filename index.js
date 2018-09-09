"use strict";

const checkDomain = require('./controllers/checkDomain.ctrl');
const checkUser = require('./controllers/checkUser.ctrl');
const checkDisposable = require('./controllers/disposable.ctrl');

const checkEmail = (email) => {
    return new Promise((resolve, reject) => {
        // First we check the domain
        checkDomain(email)
            .then(
                dResult => {
                    // If domain is not valid, we end the validation
                    if (dResult.data.isValid === false) {
                        dResult.inputEmail = email;
                        resolve(dResult);
                    } else {
                        // Secondly, we check the user
                        checkUser(email)
                            .then(
                                uResult => {
                                    // If user is not valid, we end the validation
                                    if (uResult.data.isValid === false) {
                                        uResult.inputEmail = email;
                                        resolve(uResult);
                                    } else {
                                        checkDisposable(email)
                                            .then(
                                                xResult => {
                                                    xResult.inputEmail = email;
                                                    resolve(xResult);
                                                },
                                                error => {
                                                    reject(error);
                                                }
                                            );
                                    }
                                }, 
                                error => {
                                    reject(error);
                                }
                            );
                    }
                }, 
                error => {
                    reject(error);
                }
            );
    });
};

module.exports = checkEmail;