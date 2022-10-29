"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserExist = exports.checkConfigNew = exports.checkConfigExisted = void 0;
const index_1 = __importDefault(require("../models/index"));
const helpers_1 = require("./helpers");
const helpers_2 = require("../controllers/helpers");
const Configuration = index_1.default.configuration;
const User = index_1.default.user;
const checkConfigExisted = (req, res, next) => {
    var query = { 'userId': req.params.userId };
    Configuration.findOne({
        query
    }).exec((err, config) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!config) {
            res.status(404).send({ message: "Failed! Account is already in deleted!" });
            return;
        }
        next();
    });
};
exports.checkConfigExisted = checkConfigExisted;
const checkConfigNew = (req, res, next) => {
    try {
        var query = { _id: (0, helpers_1.validEntityId)(req.body.userId) };
        User.findOne(query).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                res.status(404).send({ message: "Failed! There is no such user in the system!" });
                return;
            }
            next();
        });
    }
    catch (error) {
        if (error)
            (0, helpers_2.serverError)(error, res);
    }
};
exports.checkConfigNew = checkConfigNew;
const checkUserExist = (req, res, next) => {
    var query = { userId: req.body.userId };
    Configuration.findOne(query).exec((err, config) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (config) {
            res.status(208).send({ message: "Failed! Config associated with this user  already exist!" });
            return;
        }
        next();
    });
};
exports.checkUserExist = checkUserExist;
