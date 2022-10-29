"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Role = mongoose_1.default.model("Role", new mongoose_1.default.Schema({
    name: String
}));
exports.default = Role;
