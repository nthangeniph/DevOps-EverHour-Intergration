import Comment from '../models/comment.model';
import { NextFunction, Request, Response } from 'express';
import { getEverHourUserId } from '../utils';
import swaggerDocs from "../swagger/comment.json"

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { week, markup, taskdateid } = req.body;

    let userId = await getEverHourUserId(req.body.xApiKey)
    const d = new Date();
    let year = d.getFullYear().toString().substring(2,);
    const comment = new Comment({
        markup: JSON.stringify(markup),
        userweekid: `${userId}${year}${week}`,
        taskdateid
    });


    return comment
        .save()
        .then(comment => res.status(201).json({ comment }))
        .catch((error) => res.status(500).json({ error }))

};

const getComments = async (req: Request, res: Response, next: NextFunction) => {
    const { week } = req.params;
    let userId = await getEverHourUserId(req.body.xApiKey)
    const d = new Date();
    let year = d.getFullYear().toString().substring(2,);
    var query = { 'userweekid': `${userId}${year}${week}` };


    return Comment.find(
        query
    )
        .then(comments => {

            let listOfComments = comments.map(({ markup, _id, userweekid, taskdateid }) => {

                return ({
                    _id,
                    userweekid,
                    taskdateid,
                    markup: JSON.parse(markup)
                })
            })
            console.log("compare ::", listOfComments);
            listOfComments.length ? res.status(200).json(listOfComments) : res.status(404).json({ message: 'Not found' })
        }
        ).catch((error) => res.status(500).json({ error }))

}

const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    var query = { '_id': req.params.id };
    const { markup } = req.body;
    return Comment.findOneAndUpdate(
        query,
        { $set: { markup } },
        { new: true }
    )
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
                })

            }
        }
        )
        .catch((error) => res.status(500).json({ error }))
};

const deleteCommentById = async (req: Request, res: Response, next: NextFunction) => {
    var query = { '_id': req.params.id };

    return Comment.findOneAndDelete(
        query
    )
        .then(() => res.status(200).send({ message: "Coment deleted successfully" })
        )
        .catch((error) => res.status(500).json({ error }))

}
const getSchema = async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);

}


export { createComment, updateComment, deleteCommentById, getComments,getSchema }