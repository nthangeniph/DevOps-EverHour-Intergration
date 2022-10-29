"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accRoute = void 0;
const account_controller_1 = require("../controllers/account.controller");
const ValidateSchema_1 = require("../middleware/ValidateSchema");
const verifyAccount_1 = require("../middleware/verifyAccount");
const accRoute = function (app) {
    app.post("/api/acc/create", (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.account.create), account_controller_1.createAccount);
    app.get("/api/acc/getAll", account_controller_1.getAllAccounts);
    app.patch("/api/acc/update/:id", (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.account.update), account_controller_1.updateAccount);
    app.get("/api/acc/getAccountById/:userId", account_controller_1.getAccountById);
    app.delete("/api/acc/deleteAccountById/:userId", verifyAccount_1.checkAccountExisted, account_controller_1.deleteAccountById);
};
exports.accRoute = accRoute;
