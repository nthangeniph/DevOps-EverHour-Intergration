"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const role_model_1 = __importDefault(require("./role.model"));
const account_model_1 = __importDefault(require("./account.model"));
const configuration_model_1 = __importDefault(require("./configuration.model"));
const workItem_model_1 = __importDefault(require("./workItem.model"));
mongoose_1.default.Promise = global.Promise;
const db = {};
//@ts-ignore
db.mongoose = mongoose_1.default;
db.user = user_model_1.default;
db.role = role_model_1.default;
db.account = account_model_1.default;
db.configuration = configuration_model_1.default;
db.workItem = workItem_model_1.default;
db.ROLES = ["user", "admin", "moderator"];
exports.default = db;
