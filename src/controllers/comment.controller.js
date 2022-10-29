"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = exports.deleteCommentById = exports.updateComment = exports.createComment = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const utils_1 = require("../utils");
const createComment = async (req, res, next) => {
    const { week, markup, taskdateid } = req.body;
    let userId = await (0, utils_1.getEverHourUserId)(req.body.xApiKey);
    const d = new Date();
    let year = d.getFullYear().toString().substring(2);
    const comment = new comment_model_1.default({
        markup: JSON.stringify(markup),
        userweekid: `${userId}${year}${week}`,
        taskdateid
    });
    return comment
        .save()
        .then(comment => res.status(201).json({ comment }))
        .catch((error) => res.status(500).json({ error }));
};
exports.createComment = createComment;
const getComments = async (req, res, next) => {
    const { week } = req.params;
    let userId = await (0, utils_1.getEverHourUserId)(req.body.xApiKey);
    const d = new Date();
    let year = d.getFullYear().toString().substring(2);
    var query = { 'userweekid': `${userId}${year}${week}` };
    return comment_model_1.default.find(query)
        .then(comments => {
        let listOfComments = comments.map(({ markup, _id, userweekid, taskdateid }) => {
            return ({
                _id,
                userweekid,
                taskdateid,
                markup: JSON.parse(markup)
            });
        });
        console.log("compare ::", listOfComments);
        listOfComments.length ? res.status(200).json(listOfComments) : res.status(404).json({ message: 'Not found' });
    }).catch((error) => res.status(500).json({ error }));
};
exports.getComments = getComments;
const updateComment = async (req, res, next) => {
    var query = { '_id': req.params.id };
    const { markup } = req.body;
    return comment_model_1.default.findOneAndUpdate(query, { $set: { markup } }, { new: true })
        .exec()
        .then((commt) => {
        if (commt) {
            res.status(201).json({
                comment: {
                    id: commt._id,
                    markup: commt.markup,
                    userweekid: commt.userweekid,
                    taskdateid: commt.taskdateid,
                }
            });
        }
    })
        .catch((error) => res.status(500).json({ error }));
};
exports.updateComment = updateComment;
const deleteCommentById = async (req, res, next) => {
    var query = { '_id': req.params.id };
    return comment_model_1.default.findOneAndDelete(query)
        .then(() => res.status(200).send({ message: "Coment deleted successfully" }))
        .catch((error) => res.status(500).json({ error }));
};
exports.deleteCommentById = deleteCommentById;
