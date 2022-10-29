"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoute = void 0;
const comment_controller_1 = require("../controllers/comment.controller");
const getEverHourUserId_1 = require("../middleware/getEverHourUserId");
const commentRoute = function (app) {
    app.post("/api/comment/createComment", getEverHourUserId_1.getEverHourUserId, comment_controller_1.createComment);
    app.get("/api/comment/getComments/:week", getEverHourUserId_1.getEverHourUserId, comment_controller_1.getComments);
    app.patch("/api/comment/updateComment", comment_controller_1.updateComment);
    app.delete("/api/comment/deleteCommentById", comment_controller_1.deleteCommentById);
};
exports.commentRoute = commentRoute;
