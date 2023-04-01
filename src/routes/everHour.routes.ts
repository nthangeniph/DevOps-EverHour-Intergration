import { getWeekTasks, updateTasks, addNewTask, getProjectTasks, getAllUserProjects, getSchema } from "../controllers/everHour.controller"
import { getEverHourUserId } from '../middleware/getEverHourUserId';




const everHourRoute = function (app) {
    app.post("/api/everHour/getWeekTasks", getEverHourUserId, getWeekTasks);
    app.put("/api/everHour/updateTask", getEverHourUserId, updateTasks)
    app.get("/api/everHour/getAllUserProjects/:projectId", getEverHourUserId, getAllUserProjects);
    app.post("/api/everHour/addNewTask", getEverHourUserId, addNewTask)
    app.get("/api/everHour/getProjectTasks", getEverHourUserId, getProjectTasks);
    app.get("/api/everHour", getSchema)

}

export { everHourRoute }