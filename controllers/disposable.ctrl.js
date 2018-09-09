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
                        .subscribe(
                            json => {
                                if (success.data.domain === json.domain) {
                                    resolve({
                                        success: true,
                                        data: {
                                            domainFound: json.domain,
                                            isValid: false,
                                            reason: "Email is disposable"
                                        }
                                    });
                                }
                            }
                        )
                        .then(
                            domains => {
                                csv()
                                    .fromFile('./node_modules/misspelled-email/csv_files/disposable_wildcard_domains.csv')
                                    .subscribe(
                                        json => {
                                            if (success.data.domain.indexOf(json.domain) != -1) {
                                                resolve({
                                                    success: true,
                                                    data: {
                                                        domainFound: json.domain,
                                                        isValid: false,
                                                        reason: "Email is disposable"
                                                    }
                                                });
                                            }
                                        }
                                    )
                                    .then(
                                        wildcardDomains => {
                                            resolve ({
                                                success: true,
                                                data: {
                                                    isValid: true
                                                }
                                            });
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

module.exports = checkDisposable;