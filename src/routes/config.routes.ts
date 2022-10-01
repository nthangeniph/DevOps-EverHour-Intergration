import { CreateConfig, deleteConfigById, getConfiguration, updateConfig } from "../controllers/config.controller";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";
import { checkConfigExisted, checkConfigNew, checkUserExist } from "../middleware/verifyConfig";


const configRoute = function (app) {
    app.post("/api/config/create", [
        checkConfigNew,
        checkUserExist,
        ValidateSchema(Schemas.configuration.create)
    ], CreateConfig);
    app.patch("/api/config/update",
        ValidateSchema(Schemas.configuration.update),
        updateConfig
    );
    app.get("/api/config/getConfigById/:userId", getConfiguration);
    app.delete("/api/config/deleteConfigById/:userId", checkConfigExisted, deleteConfigById)
}

export { configRoute };