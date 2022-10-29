"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../models/index"));
const auth_config_1 = __importDefault(require("../config/auth.config"));
const User = index_1.default.user;
const Role = index_1.default.role;
const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    jsonwebtoken_1.default.verify(token, auth_config_1.default, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.body.userId = decoded.id;
        next();
    });
};
const isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find({
            _id: { $in: user.roles }
        }, (err, roles) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "Require Admin Role!" });
            return;
        });
    });
};
const isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find({
            _id: { $in: user.roles }
        }, (err, roles) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "Require Moderator Role!" });
            return;
        });
    });
};
const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
exports.default = authJwt;
