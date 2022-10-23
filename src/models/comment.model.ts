import mongoose, { Document, Schema } from 'mongoose';
import { WorkItemTypes } from '../enums';


export interface IComment {
    markup?: string;
    userweekid?: string;
    taskdateid?: string;
}

export interface IWorkItem {
    detail?: string;
    workType?: WorkItemTypes;
    taskdateid?: string;
    userweekid?: string;
}

export interface ICommentModel extends IComment, Document {

}
const commentSchema = new Schema({
    markup: { type: String, required: true },
    userweekid: { type: String, required: true },
    taskdateid: { type: String, required: true },

}, {
    timestamps: true,
}
);

export default mongoose.model<ICommentModel>("Comment", commentSchema);