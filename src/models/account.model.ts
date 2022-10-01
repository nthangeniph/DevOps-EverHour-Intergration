import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IAccount {
  pat?: string;
  devOpkey?: string;
  everhourkey?: string;
  user: Schema.Types.ObjectId | IUser
}
export interface IAccountOut {
  pat?: string;
  devOpkey?: string;
  everhourkey?: string;
  user: IUser;
}

export interface IAccountModel extends IAccount, Document {

}
const accountSchema = new Schema({
  pat: { type: String, required: true },
  devOpkey: { type: String, required: true },
  everhourkey: { type: String, required: true },
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