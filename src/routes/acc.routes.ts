import { createAccount, getAllAccounts, updateAccount, getAccountById, deleteAccountById } from "../controllers/account.controller";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";
import { checkAccountExisted } from "../middleware/verifyAccount";

const accRoute = function (app) {
    app.post("/api/acc/create", ValidateSchema(Schemas.account.create), createAccount);
    app.get("/api/acc/getAll", getAllAccounts);
    app.patch("/api/acc/update/:id", ValidateSchema(Schemas.account.update), updateAccount);
    app.get("/api/acc/getAccountById/:userId", getAccountById);
    app.delete("/api/acc/deleteAccountById/:userId", checkAccountExisted, deleteAccountById)
}


export { accRoute }