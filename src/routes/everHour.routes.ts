import { getWeekTasks, updateTasks, addNewTask, getProjectTasks, getAllUserProjects } from "../controllers/everHour.controller"
import { getEverHourUserId } from '../middleware/getEverHourUserId';




const everHourRoute = function (app) {
    app.post("/api/everHour/getWeekTasks", getEverHourUserId, getWeekTasks);
    app.put("/api/everHour/updateTask", getEverHourUserId, updateTasks)
    app.get("/api/everHour/getAllUserProjects", getEverHourUserId, getAllUserProjects);
    app.post("/api/everHour/addTask", getEverHourUserId, addNewTask)
    app.get("/api/everHour/getProjectTasks", getEverHourUserId, getProjectTasks);

}

export { everHourRoute }