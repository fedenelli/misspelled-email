"use strict";

const csv = require('csvtojson');
const desmantle = require('./desmantle.ctrl');

const checkUser = (email) => {
    return new Promise((resolve, reject) => {
        desmantle(email)
            .then(
                email => {
                    findUser(email.data.user).then(
                        success => {
                            resolve(success);
                        },
                        error => {
                            reject(error);
                        }
                    );
                },
                error => {
                    reject(error);
                }
            );
    });
};

const findUser = (user) => {
    return new Promise((resolve, reject) => {
        csv()
        .fromFile('./node_modules/misspelled-email/csv_files/invalidemailusers.csv')
        .then(
            users => {
                users.forEach(item => {
                    if (user == item.user) {
                        resolve({
                            success: true,
                            data: {
                                isValid: false,
                                reason: "User is not valid"
                            }
                        });
                    }
                });
                resolve({
                    success: true,
                    data: {
                        isValid: true
                    }
                });
            },
            error => {
                reject({
                    success: false,
                    data: {
                        error: error
                    }
                });
            }
        );
    });
};

module.exports = checkUser;