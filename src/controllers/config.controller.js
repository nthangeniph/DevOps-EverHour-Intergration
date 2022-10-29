"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConfigById = exports.updateConfig = exports.getConfiguration = exports.CreateConfig = void 0;
const configuration_model_1 = __importDefault(require("../models/configuration.model"));
const CreateConfig = (req, res, next) => {
    const { userId } = req.body;
    const configuration = new configuration_model_1.default({
        userId,
        ...req.body
    });
    return configuration
        .save()
        .then(config => res.status(201).json({ config }))
        .catch((error) => res.status(500).json({ error }));
};
exports.CreateConfig = CreateConfig;
const getConfiguration = (req, res, next) => {
    var query = { 'user': req.params.userId };
    return configuration_model_1.default.findOne(query)
        .then(account => account ? res.status(200).json({
        configuration: {
            id: account._id,
            userId: account.userId,
            companyname: account.companyname,
            projects: account.projects,
            states: account.states,
            dateFrom: account.dateFrom,
            dateTo: account.dateTo
        }
    }) : res.status(404).json({ message: 'Not found' })).catch((error) => res.status(500).json({ error }));
};
exports.getConfiguration = getConfiguration;
const updateConfig = async (req, res, next) => {
    var query = { 'userId': req.body.userId };
    return configuration_model_1.default.findOneAndUpdate(query, { $set: { ...req.body } }, { new: true })
        .exec()
        .then((config) => {
        if (config) {
            res.status(201).json({
                configuration: {
                    id: config._id,
                    userId: config.userId,
                    projects: config.projects,
                    states: config.states,
                    dateFrom: config.dateFrom,
                    dateTo: config.dateTo
                }
            });
        }
    })
        .catch((error) => res.status(500).json({ error }));
};
exports.updateConfig = updateConfig;
const deleteConfigById = async (req, res, next) => {
    var query = { 'user': req.params.userId };
    return configuration_model_1.default.findOneAndDelete(query)
        .then(() => res.status(200).send({ message: "Configuration deleted successfully" }))
        .catch((error) => res.status(500).json({ error }));
};
exports.deleteConfigById = deleteConfigById;
