"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devOpsRoute = void 0;
const devOp_controller_1 = require("../controllers/devOp.controller");
const authJwt_1 = __importDefault(require("../middleware/authJwt"));
const devOpsRoute = (app) => {
    app.post("/api/devOps/getAllWorkItems", authJwt_1.default.verifyToken, devOp_controller_1.getProjectData);
    app.patch("/api/devOps/updateWorkItems", authJwt_1.default.verifyToken, devOp_controller_1.updateWorkItems);
};
exports.devOpsRoute = devOpsRoute;
