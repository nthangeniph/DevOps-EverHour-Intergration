"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountById = exports.getAccountById = exports.updateAccount = exports.createAccount = exports.getAllAccounts = void 0;
const account_model_1 = __importDefault(require("../models/account.model"));
const createAccount = (req, res, next) => {
    const { pat, devOpsUsername, user, xApiKey, devOpsDisplayName } = req.body;
    const account = new account_model_1.default({
        pat,
        devOpsUsername,
        user,
        devOpsDisplayName,
        xApiKey
    });
    return account
        .save()
        .then(account => res.status(201).json({ account }))
        .catch((error) => res.status(500).json({ error }));
};
exports.createAccount = createAccount;
const getAllAccounts = (req, res, next) => {
    return account_model_1.default.find()
        .populate("user")
        .exec()
        .then(accounts => accounts ? res.status(200).json({
        accounts: accounts.map(acc => ({
            id: acc._id,
            pat: acc.pat,
            devOpsUsername: acc.devOpsUsername,
            devOpsDisplayName: acc.devOpsDisplayName,
            xApiKey: acc.xApiKey,
            accountHolder: acc.user.username,
            userId: acc.user._id
        }))
    }) : res.status(404).json({ message: 'No Account found' }))
        .catch((error) => res.status(500).json({ error }));
};
exports.getAllAccounts = getAllAccounts;
const updateAccount = async (req, res, next) => {
    var query = { 'user': req.params.id };
    return account_model_1.default.findOneAndUpdate(query, { $set: { ...req.body } }, { new: true })
        .populate("user")
        .exec()
        .then((account) => {
        if (account) {
            res.status(201).json({
                account: {
                    id: account._id,
                    pat: account.pat,
                    devOpsUsername: account.devOpsUsername,
                    devOpsDisplayName: account.devOpsDisplayName,
                    xApiKey: account.xApiKey,
                    accountHolder: account.user.username,
                    userId: account.user._id
                }
            });
        }
        else {
            res.status(404).json({ message: 'No Account found' });
        }
    })
        .catch((error) => res.status(500).json({ error }));
};
exports.updateAccount = updateAccount;
const getAccountById = async (req, res, next) => {
    var query = { 'user': req.params.userId };
    return account_model_1.default.findOne({
        query
    })
        .populate("user")
        .exec()
        .then(account => account ? res.status(200).json({
        account: {
            id: account._id,
            pat: account.pat,
            devOpsUsername: account.devOpsUsername,
            devOpsDisplayName: account.devOpsDisplayName,
            xApiKey: account.xApiKey,
            accountHolder: account.user.username,
            userId: account.user._id
        }
    }) : res.status(404).json({ message: 'Not found' })).catch((error) => res.status(500).json({ error }));
};
exports.getAccountById = getAccountById;
const deleteAccountById = async (req, res, next) => {
    var query = { 'user': req.params.userId };
    return account_model_1.default.findOneAndDelete(query)
        .then(() => res.status(201).json({ message: "Account deleted successfully" }))
        .catch((error) => res.status(500).json({ error }));
};
exports.deleteAccountById = deleteAccountById;
