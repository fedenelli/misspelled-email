"use strict";

const csv = require('csvtojson');
const desmantle = require('./desmantle.ctrl');

const checkDisposable = (email) => {
    return new Promise((resolve, reject) => {
        desmantle(email)
            .then(
                success => {
                    csv()
                        .fromFile('./node_modules/misspelled-email/csv_files/disposable_domains.csv')
                        .then(
                            domains => {
                                // Check for disposable domains
                                checkDomain(success.data.domain, domains)
                                    .then(
                                        response => {
                                            if (response.data.isValid === false) {
                                                resolve(response);
                                            } else {
                                                // Check for disposable wildcard domains
                                                csv()
                                                    .fromFile('./node_modules/misspelled-email/csv_files/disposable_wildcard_domains.csv')
                                                    .then(
                                                        wildcardDomains => {
                                                            checkDomain(success.data.domain, wildcardDomains, true)
                                                                .then(
                                                                    response2 => {
                                                                        resolve(response2);
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
                                            }
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
                },
                error => {
                    reject(error);
                }
            );
    });
};

const checkDomain = (domain, array, wildcard) => {
    return new Promise((resolve, reject) => {
        if (domain.indexOf('.') != -1 && array.length > 0) {
            array.forEach(item => {

                if (wildcard == true) {
                    if (domain.indexOf(item.domain) != -1) {
                        resolve({
                            success: true,
                            data: {
                                domainFound: item.domain,
                                isValid: false,
                                reason: "Email is disposable"
                            }
                        });
                    }
                } else {
                    if (domain == item.domain) {
                        resolve({
                            success: true,
                            data: {
                                domainFound: item.domain,
                                isValid: false,
                                reason: "Email is disposable"
                            }
                        });
                    }
                }
            });
            resolve ({
                success: true,
                data: {
                    isValid: true
                }
            });
        } else {
            reject({
                success: true,
                data: {
                    message: "Missing Parameters"
                }
            });
        }
    });
};

module.exports = checkDisposable;