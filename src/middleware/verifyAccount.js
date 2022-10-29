"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccountExisted = void 0;
const index_1 = __importDefault(require("../models/index"));
const Account = index_1.default.account;
const checkAccountExisted = (req, res, next) => {
    var query = { 'user': req.params.userId };
    Account.findOne({
        query
    }).exec((err, acc) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!acc) {
            res.status(404).send({ message: "Failed! Account is already in deleted!" });
            return;
        }
        next();
    });
};
exports.checkAccountExisted = checkAccountExisted;
