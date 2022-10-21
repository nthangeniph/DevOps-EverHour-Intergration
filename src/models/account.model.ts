import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IAccount {
  xApiKey?: String;
  devOpsDisplayName?: String;
  pat?: String;
  devOpsUsername?: String;
  user: Schema.Types.ObjectId | IUser
}
export interface IAccountOut {
  xApiKey?: String;
  devOpsDisplayName?: String;
  pat?: String;
  devOpsUsername?: String;
  user: IUser;
}

export interface IAccountModel extends IAccount, Document {

}
const accountSchema = new Schema({
  xApiKey: { type: String, required: true },
  pat: { type: String, required: true },
  devOpsDisplayName: { type: String, required: true },
  devOpsUsername: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true

  }

},
  {
    timestamps: true, versionKey: false
  },
);

export default mongoose.model<IAccountModel>('Account', accountSchema);