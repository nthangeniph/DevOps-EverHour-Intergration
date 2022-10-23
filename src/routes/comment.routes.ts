import { createComment, deleteCommentById, getComments, updateComment } from "../controllers/comment.controller";
import { getEverHourUserId } from '../middleware/getEverHourUserId';



const commentRoute = function (app) {
    app.post("/api/comment/createComment",
        getEverHourUserId, createComment
    );
    app.get("/api/comment/getComments/:week",
        getEverHourUserId,
        getComments
    );
    app.patch("/api/comment/updateComment",
        updateComment
    );

    app.delete("/api/comment/deleteCommentById",
        deleteCommentById
    );
}

export { commentRoute }; 
