import { CreateComment, deleteCommentById, getComments, updateComment } from "../controllers/comment.controller";
import authJwt from "../middleware";



const commentRoute = function (app) {
    app.post("/api/comment/createComment", authJwt.authJwt, CreateComment);
    app.patch("/api/comment/updateComment", authJwt.authJwt, updateComment);
    app.get("/api/comment/getComments", getComments);
    app.delete("/api/comment/deleteCommentById", deleteCommentById)
}

export { commentRoute };