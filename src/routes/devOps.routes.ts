import { getProjectData, updateWorkItems } from "../controllers/devOp.controller";
import authJwt from '../middleware/authJwt';

const devOpsRoute = (app) => {
    app.post("/api/devOps/getAllWorkItems", authJwt.verifyToken, getProjectData);
    app.patch("/api/devOps/updateWorkItems", authJwt.verifyToken, updateWorkItems)
}


export { devOpsRoute };

