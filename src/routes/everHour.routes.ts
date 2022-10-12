import { getWeekTasks } from "../controllers/everHour.controller"


const everHourRoute = function (app) {
    app.post("/api/everHour/getWeekTasks", getWeekTasks)
}

export { everHourRoute }