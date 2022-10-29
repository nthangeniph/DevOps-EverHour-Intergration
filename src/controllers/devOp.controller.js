"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkItems = exports.getProjectData = void 0;
const utils_1 = require("../utils");
const configuration_model_1 = __importDefault(require("../models/configuration.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
var request = require('request');
const getProjectData = async (req, res, next) => {
    try {
        var query = { 'userId': req.body.userId };
        let configuration;
        let accountDetails;
        await configuration_model_1.default.findOne(query)
            .then(account => {
            if (account) {
                configuration = {
                    id: account._id,
                    userId: account.userId,
                    companyname: account.companyname,
                    projects: account.projects,
                    states: account.states,
                    dateFrom: account.dateFrom,
                    dateTo: account.dateTo
                };
            }
        });
        await account_model_1.default.findOne({ 'user': req.body.userId })
            .then(account => {
            if (account) {
                accountDetails = {
                    id: account._id,
                    pat: account.pat,
                    devOpsUsername: account.devOpsUsername,
                    devOpsDisplayName: account.devOpsDisplayName
                };
            }
        });
        const { devOpsDisplayName, pat, devOpsUsername } = accountDetails;
        const state = configuration.states.map(st => `'${st}'`).join(",");
        const statesFilter = state.length ? `[System.State] IN (${state})` : ' ';
        const teamProjects = configuration.projects.map(pr => `'${pr}'`).join(",");
        const projectsFilter = teamProjects.length ? `AND [System.TeamProject] IN (${teamProjects},'PD-His')` : ' ';
        var options = {
            'method': 'POST',
            'url': `https://dev.azure.com/${configuration.companyname}/_apis/wit/wiql?api-version=6.0`,
            'headers': (0, utils_1.devopsHeaders)({ username: devOpsUsername, pat }),
            body: JSON.stringify({
                //"query": `Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.State] IN (${state}) AND [System.AssignedTo] ='${devOpsUsername}' AND [System.ChangedDate] > '2022-09-01' `
                "query": `Select [System.Id], [System.Title], [System.State] From WorkItems Where ${statesFilter}  ${projectsFilter} AND [System.AssignedTo] ='${devOpsDisplayName}'  `
            })
        };
        //script fields:
        //ChangedDate
        //WHERE [System.ResolvedDate] >= '01-18-2019' GMT and [Resolved Date/Time] < '01-09-2019 GMT'
        //WHERE [Resolved Date] >= '01-18-2019 14:30:01'
        await request(options, async function (error, response) {
            console.log("Ids ::", response);
            let ids = (JSON.parse(response.body).workItems.map(item => item.id));
            var options01 = {
                'method': 'POST',
                'url': 'https://dev.azure.com/boxfusion/_apis/wit/workitemsbatch?api-version=6.0',
                'headers': (0, utils_1.devopsHeaders)({ username: devOpsUsername, pat }),
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
                        "Microsoft.VSTS.Common.StackRank",
                        "Microsoft.VSTS.Scheduling.OriginalEstimate"
                    ]
                })
            };
            await request(options01, async function (error, response) {
                console.log("after ids ::", JSON.parse(response.body));
                try {
                    if (error)
                        res.status(500).json({ error });
                    res.status(200).send({
                        items: JSON.parse(response.body).value.map(item => {
                            console.log("all fields::", item.fields);
                            return ({
                                id: item.id,
                                title: item.fields['System.Title'],
                                state: item.fields['System.State'],
                                workItemType: item.fields['System.WorkItemType'],
                                teamProject: item.fields['System.TeamProject'],
                                changedDate: item.fields['System.ChangedDate'],
                                assignedTo: item.fields['System.AssignedTo'].displayName,
                                timeEstimate: item.fields['Microsoft.VSTS.Scheduling.OriginalEstimate']
                            });
                        })
                    });
                    return;
                }
                catch (err) {
                    res.status(500).json({ message: err });
                    return;
                }
            });
        });
    }
    catch (error) {
        res.status(500).json({ error });
        return;
    }
};
exports.getProjectData = getProjectData;
const updateWorkItems = async (req, res, next) => {
    try {
        let accountDetails;
        const { workItems } = req.body;
        await account_model_1.default.findOne({ 'user': req.body.userId })
            .then(account => {
            if (account) {
                accountDetails = {
                    id: account._id,
                    pat: account.pat,
                    devOpsUsername: account.devOpsUsername,
                    devOpsDisplayName: account.devOpsDisplayName
                };
            }
        });
        const { pat, devOpsUsername } = accountDetails;
        let updateItems = workItems;
        console.log("we here ::", req.body);
        updateItems.forEach(async ({ id, tracked }, index) => {
            var options01 = {
                'method': 'PATCH',
                'url': `https://dev.azure.com/boxfusion/_apis/wit/workitems/${id}?api-version=6.0`,
                'headers': (0, utils_1.devopsPatchHeaders)({ username: devOpsUsername, pat }),
                body: JSON.stringify([
                    {
                        op: "add",
                        path: "/fields/Custom.Tracked",
                        value: tracked,
                    }
                ])
            };
            await request(options01, async function (error, response) {
                console.log("tracked :;", (JSON.parse(response.body))['fields']['Custom.Tracked']);
            });
            if (index == updateItems.length - 1) {
                res.status(200).json({
                    message: 'devops items have been updated...'
                });
            }
        });
    }
    catch (error) {
        res.status(500).json({ error });
        return;
    }
};
exports.updateWorkItems = updateWorkItems;
