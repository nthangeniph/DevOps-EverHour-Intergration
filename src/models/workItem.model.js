"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const workItemSchema = new Schema({
    title: { type: String, required: true },
    time: { type: Number, required: true },
    status: { type: Number, required: true },
    WorkItemNumber: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
});
const WorkItem = mongoose_1.default.model('WorkItem', workItemSchema);
exports.default = WorkItem;
