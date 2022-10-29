"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schemas = exports.ValidateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const Logging_1 = __importDefault(require("../library/Logging"));
const joi_2 = __importDefault(require("joi"));
const ValidateSchema = (Schema) => {
    return async (req, res, next) => {
        try {
            await Schema.validateAsync(req.body, { abortEarly: false });
            next();
        }
        catch (error) {
            Logging_1.default.error(error);
            return res.status(422).json({ error });
        }
    };
};
exports.ValidateSchema = ValidateSchema;
exports.Schemas = {
    account: {
        create: joi_1.default.object({
            devOpsDisplayName: joi_1.default.string().required(),
            devOpsUsername: joi_1.default.string().required(),
            xApiKey: joi_1.default.string().required(),
            pat: joi_1.default.string().required(),
            user: joi_1.default.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        }),
        update: joi_1.default.object({})
    },
    configuration: {
        create: joi_1.default.object({
            companyname: joi_1.default.string().required(),
            projects: joi_1.default.array().required(),
            states: joi_1.default.array().required(),
            dateFrom: joi_1.default.string().required(),
            dateTo: joi_1.default.string().required(),
            userId: joi_1.default.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required()
        }),
        update: joi_1.default.object({
            userId: joi_1.default.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        })
    },
    user: {
        create: joi_1.default.object({
            username: joi_1.default.string().required(),
            password: joi_2.default.string().min(6).required(),
            roles: joi_1.default.array(),
        }),
        signin: joi_1.default.object({
            username: joi_1.default.string().required,
            password: joi_2.default.string().min(6).required(),
        })
    },
    everHour: {
        getWeekTasks: joi_1.default.object({})
    }
};
