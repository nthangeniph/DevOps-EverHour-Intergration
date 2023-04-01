"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validEntityId = void 0;
const bson_1 = require("bson");
const validEntityId = (_id) => {
    if (!bson_1.ObjectId.isValid(_id)) {
        throw new Error(`Invalid id: ${_id}`);
    }
    return new bson_1.ObjectId(_id);
};
exports.validEntityId = validEntityId;
