"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifySignUp_1 = __importDefault(require("../middleware/verifySignUp"));
const auth_controller_1 = require("../controllers/auth.controller");
const ValidateSchema_1 = require("../middleware/ValidateSchema");
const authRoute = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    app.post("/api/auth/signup", [
        verifySignUp_1.default.checkDuplicateUsernameOrEmail,
        verifySignUp_1.default.checkRolesExisted,
        (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.user.create)
    ], auth_controller_1.signup);
    app.post("/api/auth/signin", auth_controller_1.signin);
    app.put("/api/auth/update/:id", auth_controller_1.updateUser);
};
exports.default = authRoute;
