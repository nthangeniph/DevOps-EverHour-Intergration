"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devopsPatchHeaders = exports.getEverHourUserId = exports.everHoursHeaders = exports.devopsHeaders = void 0;
var request = require('request');
function devopsHeaders({ username, pat }) {
    const Authorization = `Basic ${Buffer.from(`${username}:${pat}`).toString("base64")}`;
    return {
        Authorization,
        'Content-Type': 'application/json',
    };
}
exports.devopsHeaders = devopsHeaders;
function devopsPatchHeaders({ username, pat }) {
    const Authorization = `Basic ${Buffer.from(`${username}:${pat}`).toString("base64")}`;
    return {
        Authorization,
        'Content-Type': 'application/json-patch+json',
    };
}
exports.devopsPatchHeaders = devopsPatchHeaders;
function everHoursHeaders(xApiKey) {
    return {
        "X-Api-Key": xApiKey,
        "Content-Type": "application/json-patch+json",
    };
}
exports.everHoursHeaders = everHoursHeaders;
async function getEverHourUserId(xApKey) {
    var optionsMe = {
        'method': 'GET',
        'url': `https://api-ro.everhour.com/users/me`,
        'headers': everHoursHeaders(xApKey),
    };
    let userId;
    return new Promise((resolve, reject) => {
        request(optionsMe, function (error, response, body) {
            userId = JSON.parse(body).id;
            if (JSON.parse(body).id) {
                resolve(JSON.parse(body).id);
            }
            else {
                reject(({ message: "ever hour user not found" }));
            }
        });
    });
}
exports.getEverHourUserId = getEverHourUserId;
