"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.everHourRoute = void 0;
const everHour_controller_1 = require("../controllers/everHour.controller");
const getEverHourUserId_1 = require("../middleware/getEverHourUserId");
const everHourRoute = function (app) {
    app.post("/api/everHour/getWeekTasks", getEverHourUserId_1.getEverHourUserId, everHour_controller_1.getWeekTasks);
    app.put("/api/everHour/updateTask", getEverHourUserId_1.getEverHourUserId, everHour_controller_1.updateTasks);
};
exports.everHourRoute = everHourRoute;
