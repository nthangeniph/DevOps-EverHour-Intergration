function serverError(err: string, res) {
    if (err) {
        res.status(500).send({ message: err.toString() });
        return;
    }
}
function catchAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err)
        });

    }

}
function getWeek(value: number) {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    //@ts-ignore
    var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));

    return Math.ceil(days / 7) - value;
}

const getDaysMonth = (start: any, end: any) => {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        const date = new Date(dt).toLocaleDateString().split("/").reverse().join('-');
        let tempDate = date.split('-').map(dt => {
            return dt.length > 1 ? dt : `0${dt}`
        });

        arr.push(`${tempDate[0]}-${tempDate[2]}-${tempDate[1]}`);
    }

    return arr;
};
export {
    serverError,
    catchAsync,
    getWeek,
    getDaysMonth
}