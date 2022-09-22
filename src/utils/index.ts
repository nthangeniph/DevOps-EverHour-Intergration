
export interface IDevopsUser {
    username?: String;
    pat?: String;
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
function everHoursHeaders(xApiKey: string) {

    return {
        "X-Api-Key": xApiKey,
        "Content-Type": "application/json-patch+json",
    };


}

export { devopsHeaders, everHoursHeaders };

