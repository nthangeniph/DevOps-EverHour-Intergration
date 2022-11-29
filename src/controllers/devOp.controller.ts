import { devopsHeaders, devopsPatchHeaders } from '../utils';
import { Request, Response, NextFunction } from 'express';
import Configuration from '../models/configuration.model';
import User from '../models/user.model';

export interface IUpdateItem {
    id?: number;
    tracked?: boolean;
}
var request = require('request');

const getProjectData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var query = { userId: req.body.userId };
        let configuration;
        let accountDetails;
        let projects;

        await Configuration.findOne(query).then((user) => {
            if (user) {
                configuration = {
                    id: user._id,
                    userId: user.userId,
                    companyname: user.companyname,
                    projects: user.projects,
                    states: user.states,
                    dateFrom: user.dateFrom,
                    dateTo: user.dateTo
                };
            }
        });
        await User.findOne({ _id: req.body.userId }).then((user) => {
            if (user) {
                accountDetails = {
                    id: user._id,
                    pat: user.pat,
                    devOpsUsername: user.devOpsUsername,
                    devOpsDisplayName: user.devOpsDisplayName
                };
            }
        });

        const { devOpsDisplayName, pat, devOpsUsername } = req.body;

        const state = configuration.states.map((st) => `'${st}'`).join(',');
        const statesFilter = state.length ? `[System.State] IN (${state})` : ' ';
        const teamProjects = configuration.projects.map((pr) => `'${pr}'`).join(',');
        const projectsFilter = teamProjects.length ? `AND [System.TeamProject] IN (${teamProjects})` : ' ';
        let dateFilter: string = '';
        if (configuration.dateFrom && configuration.dateTo) {
            dateFilter = `AND [System.ChangedDate] >='${configuration.dateFrom.substring(0, 10)}' AND [System.ChangedDate] <='${configuration.dateTo.substring(0, 10)}'`;
        } else if (configuration.dateFrom) {
            dateFilter = `AND [System.ChangedDate] >= '${configuration.dateFrom.substring(0, 10)}'`;
        } else {
            var today = new Date();
            var priorDate = new Date(new Date().setDate(today.getDate() - 30)).toISOString().substring(0, 10);
            dateFilter = `AND [System.ChangedDate] >= '${priorDate}'`;
        }

        var options01 = {
            method: 'GET',
            url: 'https://dev.azure.com/boxfusion/_apis/projects?api-version=7.0',
            headers: devopsHeaders({ username: devOpsUsername, pat })
        };
        await request(options01, async function (error, response) {
            projects = JSON.parse(response.body).value.map((proj) => {
                return {
                    id: proj.id,
                    name: proj.name
                };
            });


            var options = {
                method: 'POST',
                url: `https://dev.azure.com/${configuration.companyname}/_apis/wit/wiql?api-version=6.0`,
                headers: devopsHeaders({ username: devOpsUsername, pat }),

                body: JSON.stringify({
                    query: `Select [System.Id], [System.Title], [System.State],[System.ChangedDate] From WorkItems Where ${statesFilter}  ${projectsFilter} AND [System.AssignedTo] ='${devOpsDisplayName}' ${dateFilter}`
                })
            };


            await request(options, async function (error, response) {

                let ids = !!JSON.parse(response.body) ? JSON.parse(response.body).workItems.map((item) => item.id) : [];


                if (ids.length) {
                    var options01 = {
                        method: 'POST',
                        url: 'https://dev.azure.com/boxfusion/_apis/wit/workitemsbatch?api-version=6.0',
                        headers: devopsHeaders({ username: devOpsUsername, pat }),

                        body: JSON.stringify({
                            ids: ids,
                            fields: [
                                'System.Id',
                                'System.Title',
                                'System.State',
                                'System.WorkItemType',
                                'System.AssignedTo',
                                'System.TeamProject',
                                'System.Tags',
                                'System.ChangedDate',
                                'Custom.Tracked',
                                'Microsoft.VSTS.Common.StackRank',
                                'Microsoft.VSTS.Scheduling.OriginalEstimate'
                            ]
                        })
                    };
                    await request(options01, async function (error, response) {
                        try {
                            if (JSON.parse(response.body).message) res.status(500).json({ message: JSON.parse(response.body).message });
                            res.status(200).send({
                                items: JSON.parse(response.body).value.map((item) => {
                                    return {
                                        id: item.id,
                                        title: item.fields['System.Title'],
                                        state: item.fields['System.State'],
                                        workItemType: item.fields['System.WorkItemType'],
                                        teamProject: item.fields['System.TeamProject'],
                                        changedDate: item.fields['System.ChangedDate'],
                                        tracked: item.fields['Custom.Tracked'],
                                        assignedTo: item.fields['System.AssignedTo'].displayName,
                                        timeEstimate: item.fields['Microsoft.VSTS.Scheduling.OriginalEstimate']
                                    };
                                }),
                                Projects: projects
                            });
                            return;
                        } catch (err) {
                            res.status(500).json({ message: err });
                            return;
                        }
                    });
                } else {
                    res.status(200).send({
                        items: [],
                        Projects: projects
                    });
                    return;
                }
            });


        });

    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};

const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    const { pat, devOpsUsername } = req.body;
    let projects;

    try {
        var options01 = {
            method: 'GET',
            url: 'https://dev.azure.com/boxfusion/_apis/projects?api-version=7.0',
            headers: devopsHeaders({ username: devOpsUsername, pat })
        };

        await request(options01, async function (error, response) {




            if (JSON.parse(response.body).value) {
                projects = JSON.parse(response.body).value.map((proj) => {
                    return {
                        id: proj.id,
                        name: proj.name
                    };
                })
                res.status(200).json({
                    projects
                })
                return;
            } else {
                res.status(404).json({
                    message: 'Projects not found'
                })
                return;
            }
        })
    } catch (error) {
        res.status(500).json({ error });
        return;

    }
}

const updateWorkItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accountDetails;

        const { workItems } = req.body;

        await User.findOne({ _id: req.body.userId }).then((user) => {
            if (user) {
                accountDetails = {
                    id: user._id,
                    pat: user.pat,
                    devOpsUsername: user.devOpsUsername,
                    devOpsDisplayName: user.devOpsDisplayName
                };
            }
        });
        const { pat, devOpsUsername } = accountDetails;
        let updateItems: Array<IUpdateItem> = workItems;

        updateItems.forEach(async ({ id, tracked }, index) => {
            var options01 = {
                method: 'PATCH',
                url: `https://dev.azure.com/boxfusion/_apis/wit/workitems/${id}?api-version=6.0`,
                headers: devopsPatchHeaders({ username: devOpsUsername, pat }),

                body: JSON.stringify([
                    {
                        op: 'add',
                        path: '/fields/Custom.Tracked',
                        value: tracked
                    }
                ])
            };

            await request(options01, async function (error, response) {
                console.log('tracked :;', JSON.parse(response.body)['fields']['Custom.Tracked']);
            });

            if (index == updateItems.length - 1) {
                res.status(200).json({
                    message: 'devops items have been updated...'
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error });
        return;
    }
};

export { getProjectData, updateWorkItems, getAllProjects };
