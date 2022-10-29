"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authJwt_1 = __importDefault(require("../middleware/authJwt"));
const user_controller_1 = require("../controllers/user.controller");
const userRoute = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    app.get("/api/test/all", user_controller_1.allAccess);
    app.get("/api/test/user", [authJwt_1.default.verifyToken], user_controller_1.userBoard);
    app.get("/api/test/mod", [authJwt_1.default.verifyToken, authJwt_1.default.isModerator], user_controller_1.moderatorBoard);
    app.get("/api/test/admin", [authJwt_1.default.verifyToken, authJwt_1.default.isAdmin], user_controller_1.adminBoard);
};
exports.default = userRoute;
