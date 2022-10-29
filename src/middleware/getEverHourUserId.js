"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEverHourUserId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_config_1 = __importDefault(require("../config/auth.config"));
const account_model_1 = __importDefault(require("../models/account.model"));
const getEverHourUserId = async (req, res, next) => {
    let token = req.headers.authorization;
    try {
        let accountDetails;
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        jsonwebtoken_1.default.verify(token, auth_config_1.default, async (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }
            await account_model_1.default.findOne({ 'user': decoded.id })
                .then(account => {
                if (account) {
                    accountDetails = {
                        id: account._id,
                        xApiKey: account.xApiKey
                    };
                }
            });
            req.body.xApiKey = accountDetails.xApiKey;
            next();
        });
    }
    catch (error) {
        console.log('something went wrong');
    }
};
exports.getEverHourUserId = getEverHourUserId;
