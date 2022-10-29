"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configRoute = void 0;
const config_controller_1 = require("../controllers/config.controller");
const ValidateSchema_1 = require("../middleware/ValidateSchema");
const verifyConfig_1 = require("../middleware/verifyConfig");
const configRoute = function (app) {
    app.post("/api/config/create", [
        verifyConfig_1.checkConfigNew,
        verifyConfig_1.checkUserExist,
        (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.configuration.create)
    ], config_controller_1.CreateConfig);
    app.patch("/api/config/update", (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.configuration.update), config_controller_1.updateConfig);
    app.get("/api/config/getConfigById/:userId", config_controller_1.getConfiguration);
    app.delete("/api/config/deleteConfigById/:userId", verifyConfig_1.checkConfigExisted, config_controller_1.deleteConfigById);
};
exports.configRoute = configRoute;
