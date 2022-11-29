import { Request, Response, NextFunction } from 'express';
import { everHoursHeaders, getEverHourUserId } from '../utils';
import { getDaysMonth, getWeek } from './helpers';

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
            if (error) throw new Error(error);

            const { comment, date, user, manualTime } = JSON.parse(response.body);
            console.log("returned::", comment, date, user, manualTime);
            res.status(200).json({ comment, date, user, time: manualTime });
        });
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};
const getWeekTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = await getEverHourUserId(req.body.xApiKey);

        const { xApiKey, limit } = req.body;
        const count = parseInt(limit);

        var timeSheets = [];
        let organisationProjects = await getAllProjects({ userId, xApiKey });
        for (let i = 0; i < count; i++) {
            let week = getWeek(i);
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

export { getWeekTasks, updateTasks };
