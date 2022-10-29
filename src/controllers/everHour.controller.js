"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTasks = exports.getWeekTasks = void 0;
const utils_1 = require("../utils");
var request = require('request');
const updateTasks = async (req, res, next) => {
    try {
        let userId = await (0, utils_1.getEverHourUserId)(req.body.xApiKey);
        const { xApiKey, date, time, comment, taskId } = req.body;
        var optionsMe = {
            'method': 'PUT',
            'url': `https://api.everhour.com/tasks/${taskId}/time`,
            'headers': {
                'X-Api-Key': `${xApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "date": date,
                "comment": comment,
                "commentLine": null,
                "user": userId,
                "time": (3600 * time)
            }),
        };
        request(optionsMe, function (error, response) {
            if (error)
                throw new Error(error);
            const { comment, date, user, manualTime } = JSON.parse(response.body);
            res.status(200).send({ comment, date, user, time: manualTime });
        });
    }
    catch (error) {
        res.status(500).json({ error });
        return;
    }
};
exports.updateTasks = updateTasks;
const getWeekTasks = async (req, res, next) => {
    try {
        let userId = await (0, utils_1.getEverHourUserId)(req.body.xApiKey);
        const { xApiKey, week } = req.body;
        let organisationProjects = await getAllProjects({ userId, xApiKey });
        const d = new Date();
        let year = d.getFullYear().toString().substring(2);
        var optionsMe = {
            'method': 'GET',
            'url': `https://api.everhour.com/timesheets/${userId}${year}${week}`,
            'headers': (0, utils_1.everHoursHeaders)(xApiKey),
        };
        request(optionsMe, function (error, response, body) {
            const { id, week, tasks, taskTime, dailyTime } = JSON.parse(body);
            console.log("dailyTime ::", dailyTime);
            const dailyTimes = dailyTime.map(({ date }) => date);
            const taskTimes = taskTime
                .reduce((obj, { date, comment, manualTime, task: { id } }) => {
                if (!obj[id]) {
                    obj[id] = [];
                }
                obj[id] = [...obj[id], {
                        id,
                        date,
                        comment,
                        manualTime,
                    }];
                return obj;
            }, {});
            let resultTasks = tasks.map(({ task: { projects, id: taskId, name, } }) => {
                return ({
                    task: {
                        id: taskId,
                        name,
                        projectId: projects[0],
                        projectName: organisationProjects.filter(({ id }) => projects[0] == id)[0].name,
                        taskTimes: taskTimes[taskId] || [],
                        totalTime: 0
                    }
                });
            });
            const result = resultTasks.map(({ task }) => {
                if (!!task.taskTimes) {
                    let totalTime = task.taskTimes.map(tsk => tsk.manualTime).reduce((CurrentTime, time) => {
                        return CurrentTime + time;
                    }, 0);
                    return ({ ...task, totalTime: totalTime });
                }
                return task;
            });
            res.status(200).send({ result, dailyTimes });
        });
    }
    catch (error) {
        res.status(500).json({ error });
        return;
    }
};
exports.getWeekTasks = getWeekTasks;
function getAllProjects({ xApiKey, userId }) {
    return new Promise(async (resolve, reject) => {
        var options = {
            'method': 'GET',
            'url': `https://api.everhour.com/projects`,
            'headers': (0, utils_1.everHoursHeaders)(xApiKey),
        };
        let userProjects = [];
        await request(options, async function (error, response, body) {
            userProjects = await JSON.parse(body).filter(project => {
                return !!project.users.find(user => {
                    return user == userId;
                });
            });
            if (userProjects) {
                resolve(userProjects);
            }
            else {
                reject({ message: "No Projects Found " });
            }
        });
        return userProjects;
    });
}
;
