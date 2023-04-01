import { Request, Response, NextFunction } from 'express';
import { everHoursHeaders, getEverHourUserId } from '../utils';
import { getDaysMonth, getWeek } from './helpers';
import swaggerDocs from "../swagger/everHour.json"

var request = require('request');

const updateTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = await getEverHourUserId(req.body.xApiKey);

        const { xApiKey, date, manualTime: time, comment, taskId } = req.body;

        var optionsMe = {
            method: 'PUT',
            url: `https://api.everhour.com/tasks/${taskId}/time`,
            headers: {
                'X-Api-Key': `${xApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: date,
                comment: comment,
                commentLine: null,
                user: userId,
                time
            })
        };

        request(optionsMe, function (error, response) {
            if (JSON.parse(response.body).errors) throw new Error(JSON.stringify(JSON.parse(response.body).errors));

            const { comment, date, user, manualTime } = JSON.parse(response.body);
            console.log("everHour ::", error);


            res.status(200).json({ comment, date, user, time: manualTime });
            return;
        });
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};
function getAllProjects({ xApiKey, userId }): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
        var options = {
            method: 'GET',
            url: `https://api.everhour.com/projects`,
            headers: everHoursHeaders(xApiKey)
        };
        let userProjects = [];
        await request(options, async function (error, response, body) {
            userProjects = await JSON.parse(body).filter((project) => {
                return !!project.users.find((user) => {
                    return user == userId;
                });
            });
            if (userProjects) {
                resolve(userProjects);
            } else {
                reject({ message: 'No Projects Found ' });
            }
        });
        return userProjects;
    });
}
const getWeekTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = await getEverHourUserId(req.body.xApiKey);

        const { xApiKey, limit } = req.body;
        const count = parseInt(limit);

        var timeSheets = [];
        let organisationProjects = await getAllProjects({ userId, xApiKey });

        for (let i = 0; i < count; i++) {
            let week = getWeek(i) < 10 ? `0${getWeek(i)}` : getWeek(i);
            const d = new Date();
            let year = d.getFullYear().toString().substring(2);
            var optionsMe = {
                method: 'GET',
                url: `https://api.everhour.com/timesheets/${userId}${year}${week}`,
                headers: everHoursHeaders(xApiKey)
            };

            request(optionsMe, async function (error, response, body) {
                const { week, tasks, taskTime } = JSON.parse(body);
                const taskTimes = (await !!taskTime)
                    ? (taskTime as Array<any>).reduce((obj, { date, comment, manualTime, task: { id } }) => {

                        if (!obj[id]) {
                            obj[id] = [];
                        }
                        obj[id] = [
                            ...obj[id],
                            {
                                id,
                                date,
                                comment,
                                manualTime
                            }
                        ];

                        return obj;
                    }, {})
                    : {};

                let resultTasks = !!tasks
                    ? tasks.map(({ task: { projects, id: taskId, name } }) => {
                        return {
                            task: {
                                id: taskId,
                                name,
                                projectId: projects[0],
                                projectName: organisationProjects.filter(({ id }) => projects[0] == id)[0].name,
                                taskTimes: taskTimes[taskId] || [],
                                totalTime: 0
                            }
                        };
                    })
                    : [];

                const weekTasks = resultTasks.map(({ task }) => {
                    if (!!task.taskTimes) {
                        let totalTime = task.taskTimes
                            .map((tsk) => tsk.manualTime)
                            .reduce((CurrentTime, time) => {
                                return CurrentTime + time;
                            }, 0);
                        return { ...task, totalTime: totalTime };
                    }
                    console.log("comment", task)
                    return task;
                });

                const dailyTimes = getDaysMonth(week.from, week.to);
                timeSheets.push({ weekTasks, week, dailyTimes });

                if (timeSheets.length == limit) {
                    const sortTimeSheet = timeSheets.sort(function (a, b) {
                        let start = parseInt(a.week.from.substring(5, 7));
                        let end = parseInt(b.week.from.substring(5, 7));
                        if (end - start == 0) {
                            let start = parseInt(a.week.from.substring(8, 11));
                            let end = parseInt(b.week.from.substring(8, 11));
                            return end - start
                        }
                        return end - start
                    });
                    res.status(200).send({ timeSheets: sortTimeSheet });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};




const getAllUserProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = await getEverHourUserId(req.body.xApiKey);


        const { xApiKey } = req.body;

        var options = {
            method: 'GET',
            url: `https://api.everhour.com/projects`,
            headers: everHoursHeaders(xApiKey)
        };

        let userProjects = [];
        await request(options, async function (error, response, body) {
            userProjects = await JSON.parse(body).filter((project) => {
                return !!project.users.find((user) => {
                    return user == userId;
                });
            });


            res.status(200).json(userProjects);
            return;
        });
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};



const addNewTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = await getEverHourUserId(req.body.xApiKey);


        const { xApiKey, week, tasks } = req.body;
        const date = new Date();
        let year = date.getFullYear().toString().substring(2);
        console.log("week ::", week);


        var optionsMe = {
            method: 'POST',
            url: `https://api.everhour.com/timesheets/${userId}${year}${week}/tasks`,
            headers: {
                'X-Api-Key': `${xApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tasks: tasks,
            })
        };

        request(optionsMe, function (error, response) {
            if (JSON.parse(response.body).errors) throw new Error(JSON.stringify(JSON.parse(response.body).errors));

            const { task, id } = JSON.parse(response.body);
            console.log("everHour ::", error);


            res.status(200).json({ id, task });
            return;
        });
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};
const getProjectTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { projectId } = req.query;
        const { xApiKey } = req.body;

        var optionsMe = {
            method: 'GET',
            url: `https://api.everhour.com/projects/${projectId}/tasks?page=1&limit=250`,
            headers: {
                'X-Api-Key': `${xApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

            })
        };

        request(optionsMe, function (error, response) {
            if (JSON.parse(response.body).errors) throw new Error(JSON.stringify(JSON.parse(response.body).errors));

            const tasks = JSON.parse(response.body);
            let nameIds = tasks.map(({ id, name }) => ({ id, name }))



            res.status(200).json(nameIds);
            return;
        });
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};
const getSchema = async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);

}
export { getWeekTasks, updateTasks, addNewTask, getProjectTasks, getAllUserProjects, getSchema };
