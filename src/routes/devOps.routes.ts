import { getProjectData } from "../controllers/devOp.controller";

const devOpsRoute=(app)=>{
    app.post("/api/devOps/getAllWorkItems", getProjectData);
}


export {devOpsRoute};