"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.serverError = void 0;
function serverError(err, res) {
    if (err) {
        res.status(500).send({ message: err.toString() });
        return;
    }
}
exports.serverError = serverError;
function catchAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        });
    };
}
exports.catchAsync = catchAsync;
