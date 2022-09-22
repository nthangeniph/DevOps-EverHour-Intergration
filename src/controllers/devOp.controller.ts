import { devopsHeaders } from "../utils";
import { serverError } from "./helpers";


var request = require('request');

const getProjectData = async (req, res) => {
    const { username, pat } = req.body;

    var options = {
        'method': 'POST',
        'url': 'https://dev.azure.com/boxfusion/_apis/wit/wiql?api-version=6.0',
        'headers': devopsHeaders({ username, pat }),


        body: JSON.stringify({

            "query": "Select [System.Id], [System.Title], [System.State] From WorkItems Where [State] ='Resolved' AND [System.AssignedTo] ='Phumudzo Nthangeni' "
        })

    };
    request(options, function (error, response) {

        let ids = (JSON.parse(response.body).workItems.map(item => item.id))

        if (error) serverError(error, res);

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
                    "Microsoft.VSTS.Common.StackRank"
                ]
            })

        };
        request(options01, function (error, response) {
            if (error) serverError(error, res);
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

        })
    }
    )
}

export { getProjectData }