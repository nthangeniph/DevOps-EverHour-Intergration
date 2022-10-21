import { getProjectData } from "../controllers/devOp.controller";
import authJwt from '../middleware/authJwt';

const devOpsRoute = (app) => {
    app.post("/api/devOps/getAllWorkItems", authJwt.verifyToken, getProjectData);
}


export { devOpsRoute };

