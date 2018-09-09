"use strict";

const csv = require('csvtojson');
const desmantle = require('./desmantle.ctrl');

const misspelled = (email) => {
    let fullEmail = email;
    return new Promise((resolve, reject) => {
        desmantle(email)
            .then(
                email => {
                    findDomain(email.data.domain).then(
                        success => {
                            if (success.data.type === "typo") {
                                success.data.correctEmail = fullEmail.replace(success.data.domain, success.data.correct);
                            }
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

const findDomain = (domain) => {
    return new Promise((resolve, reject) => {
        csv()
        .fromFile('./node_modules/misspelled-email/csv_files/invalidemaildomains.csv')
        .subscribe(
            json => {
                if (domain === json.domain) {
                    json.isValid = false;
                    json.reason = "Wrong domain";
                    resolve({
                        success: true,
                        data: json
                    });
                }
            }
        )
        .then(
            domains => {
                resolve({
                    success: true,
                    data: {
                        type: "valid",
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

module.exports = misspelled;