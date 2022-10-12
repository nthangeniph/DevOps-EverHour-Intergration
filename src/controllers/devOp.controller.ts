import { devopsHeaders } from "../utils";
import { Request, Response, NextFunction } from 'express';
import Configuration from "../models/configuration.model";


var request = require('request');

const getProjectData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var query = { 'userId': req.body.userId };
        let configuration;

        await Configuration.findOne(query)
            .then(account => {
                if (account) {
                    configuration = {
                        id: account._id,
                        userId: account.userId,
                        companyname: account.companyname,
                        displayname: account.displayname,
                        projects: account.projects,
                        states: account.states,
                        dateFrom: account.dateFrom,
                        dateTo: account.dateTo
                    }
                }
            }
            )
        const { username, pat, devOpsUsername } = req.body;

        const state = configuration.states.map(st => `'${st}'`).join(",");
        const statesFilter = state.length ? `[System.State] IN (${state})` : ' ';
        const teamProjects = configuration.projects.map(pr => `'${pr}'`).join(",");
        const projectsFilter = teamProjects.length ? `AND [System.TeamProject] IN (${teamProjects},'PD-His')` : ' ';




        var options = {
            'method': 'POST',
            'url': `https://dev.azure.com/${configuration.companyname}/_apis/wit/wiql?api-version=6.0`,
            'headers': devopsHeaders({ username, pat }),


            body: JSON.stringify({
                //"query": `Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.State] IN (${state}) AND [System.AssignedTo] ='${devOpsUsername}' AND [System.ChangedDate] > '2022-09-01' `
                "query": `Select [System.Id], [System.Title], [System.State] From WorkItems Where ${statesFilter}  ${projectsFilter} AND [System.AssignedTo] ='${devOpsUsername}'  `
            })

        };




        //script fields:
        //ChangedDate
        //WHERE [System.ResolvedDate] >= '01-18-2019' GMT and [Resolved Date/Time] < '01-09-2019 GMT'
        //WHERE [Resolved Date] >= '01-18-2019 14:30:01'
        await request(options, async function (error, response) {
            let ids = (JSON.parse(response.body).workItems.map(item => item.id));



            var options01 = {
                'method': 'POST',
                'url': 'https://dev.azure.com/boxfusion/_apis/wit/workitemsbatch?api-version=6.0',
                'headers': devopsHeaders({ username, pat }),


                body: JSON.stringify({
                    "ids": ids,
                    "fields": [
                        "System.Id",
                        "System.Title",
                        "System.State",
                        "System.WorkItemType",
                        "System.AssignedTo",
                        "System.TeamProject",
                        "System.Tags",
                        "System.ChangedDate",
                        "Custom.Tracked",
                        "Microsoft.VSTS.Common.StackRank"
                    ]
                })

            }
            await request(options01, async function (error, response) {

                try {
                    if (error) res.status(500).json({ error })
                    res.status(200).send({
                        items: JSON.parse(response.body).value.map(item => {
                            return ({
                                id: item.id,
                                title: item.fields['System.Title'],
                                state: item.fields['System.State'],
                                workItemType: item.fields['System.WorkItemType'],
                                teamProject: item.fields['System.TeamProject'],
                                changedDate: item.fields['System.ChangedDate'],
                                assignedTo: item.fields['System.AssignedTo'].displayName
                            })
                        })
                    })
                    return;

                } catch (err) {
                    res.status(500).json({ message: err });
                    return;
                }
            })


        })
    } catch (error) {

        res.status(500).json({ error })
        return;
    }

}


export { getProjectData }