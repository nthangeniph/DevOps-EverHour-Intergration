import { Request, Response, NextFunction } from 'express';
import { everHoursHeaders, getEverHourUserId } from '../utils';


var request = require('request');


const updateTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = await getEverHourUserId(req.body.xApiKey)

        const { xApiKey, date, time, comment, taskId } = req.body;


        var optionsMe = {
            'method': 'PUT',
            'url': `https://api.everhour.com/tasks/${taskId}/time`,
            'headers': everHoursHeaders(xApiKey),
            'body': JSON.stringify({ time, date, comment, user: userId })


        };

        request(optionsMe, function (error, response, body) {
            console.log("user ::", response, JSON.parse(body))

            const { comment, date, user, time } = JSON.parse(body);

            res.status(200).send({ comment, date, user, time })

        })
    } catch (error) {
        res.status(500).json({ error })
        return;
    }
};
const getWeekTasks = async (req: Request, res: Response, next: NextFunction) => {

    try {

        let userId = await getEverHourUserId(req.body.xApiKey)

        const { xApiKey, week } = req.body;
        let organisationProjects = await getAllProjects({ userId, xApiKey });

        const d = new Date();
        let year = d.getFullYear().toString().substring(2,);
        var optionsMe = {
            'method': 'GET',
            'url': `https://api.everhour.com/timesheets/${userId}${year}${week}`,
            'headers': everHoursHeaders(xApiKey),
        };

        request(optionsMe, function (error, response, body) {

            const { id, week, tasks, taskTime, dailyTime } = JSON.parse(body);
            console.log("dailyTime ::", dailyTime)
            const dailyTimes = dailyTime.map(({ date }) => date)
            const taskTimes = (taskTime as Array<any>)
                .reduce((obj,
                    { date, comment, manualTime, task: { id } }) => {
                    if (!obj[id]) {
                        obj[id] = [];
                    }
                    obj[id] = [...obj[id], {
                        id,
                        date,
                        comment,
                        manualTime,

                    }]
                    return obj;
                }, {});

            let resultTasks = tasks.map(({ task: {
                projects,
                id: taskId,
                name,
            } }) => {
                return (
                    {

                        task: {
                            id: taskId,
                            name,
                            projectId: projects[0],
                            projectName: organisationProjects.filter(({ id }) => projects[0] == id)[0].name,
                            taskTimes: taskTimes[taskId] || [],
                            totalTime: 0

                        }

                    }
                )
            })

            const result = resultTasks.map(({ task }) => {
                if (!!task.taskTimes) {
                    let totalTime = task.taskTimes.map(tsk => tsk.manualTime).reduce((CurrentTime, time) => {
                        return CurrentTime + time
                    }, 0)
                    return ({ ...task, totalTime: totalTime })
                }
                return task
            });

            res.status(200).send({ result, dailyTimes })

        })


    } catch (error) {
        res.status(500).json({ error })
        return;
    }
}

function getAllProjects({ xApiKey, userId }): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
        var options = {
            'method': 'GET',
            'url': `https://api.everhour.com/projects`,
            'headers': everHoursHeaders(xApiKey),
        };
        let userProjects = [];
        await request(options, async function (error, response, body) {
            userProjects = await JSON.parse(body).filter(project => {
                return !!project.users.find(user => {
                    return user == userId
                })

            });
            if (userProjects) {
                resolve(userProjects)
            } else {
                reject({ message: "No Projects Found " })
            }
        });
        return userProjects;
    })
};

export { getWeekTasks, updateTasks };