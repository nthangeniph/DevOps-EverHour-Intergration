import { getWeekTasks, updateTasks } from "../controllers/everHour.controller"
import { getEverHourUserId } from '../middleware/getEverHourUserId';




const everHourRoute = function (app) {
    app.post("/api/everHour/getWeekTasks", getEverHourUserId, getWeekTasks);
    app.put("/api/everHour/updateTask", getEverHourUserId, updateTasks)
}

export { everHourRoute }