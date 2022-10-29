"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_json_1 = __importDefault(require("./authentication.json"));
const account_json_1 = __importDefault(require("./account.json"));
const devOps_json_1 = __importDefault(require("./devOps.json"));
const configuration_json_1 = __importDefault(require("./configuration.json"));
const everHour_json_1 = __importDefault(require("./everHour.json"));
const comment_json_1 = __importDefault(require("./comment.json"));
const lodash_1 = __importDefault(require("lodash"));
let combinedJson = lodash_1.default.merge(authentication_json_1.default, account_json_1.default, devOps_json_1.default, configuration_json_1.default, everHour_json_1.default, comment_json_1.default);
exports.default = combinedJson;
