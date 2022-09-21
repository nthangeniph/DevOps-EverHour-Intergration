import { createAccount, getAllAccounts ,updateAccount,getAccountById,deleteAccountById} from "../controllers/account.controller";
import { checkAccountExisted } from "../middleware/verifyAccount";

const accRoute = function(app) {
app.post("/api/acc/create", createAccount);
app.get("/api/acc/getAll",getAllAccounts);
app.patch("/api/acc/update/:id",updateAccount);
app.get("/api/acc/getAccountById/:userId",getAccountById);
app.delete("/api/acc/deleteAccountById/:userId",checkAccountExisted,deleteAccountById)
}


export {accRoute}