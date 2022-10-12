import { Request, Response, NextFunction } from 'express';
import { everHoursHeaders } from '../utils';

var request = require('request');

const getWeekTasks = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userWeekId = req.body.userWeekId;
        const { userId, xApiKey } = req.body;
        let organisationProjects = await getAllProjects({ userId, xApiKey });


        var optionsMe = {
            'method': 'GET',
            'url': `https://api.everhour.com/timesheets/${userWeekId}`,
            'headers': everHoursHeaders(xApiKey),


        };

        request(optionsMe, function (error, response, body) {

            const { id, week, tasks, taskTime } = JSON.parse(body);
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
            // taskTimes.map(tsk => console.log(tsk));
            // console.log('taskkkk::', taskTimes)

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
                            taskTimes: taskTimes[taskId],
                            totalTime: taskTimes.totalTime

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

            res.status(200).send(result)
            console.log("finished ::", new Date().getSeconds())
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

export { getWeekTasks };