var request = require('request');
export interface IDevopsUser {
    username?: string;
    pat?: string;
}
function devopsHeaders({ username, pat }: IDevopsUser) {
    const Authorization = `Basic ${Buffer.from(
        `${username}:${pat}`
    ).toString("base64")}`;

    return {

        Authorization,
        'Content-Type': 'application/json',
    };
}
function devopsPatchHeaders({ username, pat }: IDevopsUser) {
    const Authorization = `Basic ${Buffer.from(
        `${username}:${pat}`
    ).toString("base64")}`;

    return {

        Authorization,
        'Content-Type': 'application/json-patch+json',
    };
}
function everHoursHeaders(xApiKey: string) {

    return {
        "X-Api-Key": xApiKey,
        "Content-Type": "application/json-patch+json",
    };


}

async function getEverHourUserId(xApKey: string) {
    var optionsMe = {
        'method': 'GET',
        'url': `https://api-ro.everhour.com/users/me`,
        'headers': everHoursHeaders(xApKey),


    };
    let userId;

    return new Promise((resolve, reject) => {
        request(optionsMe, function (error, response, body) {
            userId = JSON.parse(body).id;
            if (JSON.parse(body).id) {
                resolve(JSON.parse(body).id)
            } else {
                reject(({ message: "ever hour user not found" }))
            }
        });

    })

}

export { devopsHeaders, everHoursHeaders, getEverHourUserId ,devopsPatchHeaders};

