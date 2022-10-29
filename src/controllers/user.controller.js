"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderatorBoard = exports.adminBoard = exports.userBoard = exports.allAccess = void 0;
const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.allAccess = allAccess;
const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.userBoard = userBoard;
const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
exports.adminBoard = adminBoard;
const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};
exports.moderatorBoard = moderatorBoard;
