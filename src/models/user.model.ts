import mongoose, { Document, Schema } from 'mongoose';
import { IRoleOut } from './role.model';

export interface IUser {
  username?: String;
  email?: String;
  password?: String;
  roles?: Array<Schema.Types.ObjectId>;
  xApiKey?: String;
  devOpsDisplayName?: String;
  pat?: String;
  devOpsUsername?: String;
}
export interface IUserOut {
  _id?: String;
  username?: String;
  email?: String;
  password?: String;
  roles?: Array<IRoleOut>;
  xApiKey?: String;
  devOpsDisplayName?: String;
  pat?: String;
  devOpsUsername?: String;
}
export interface IUserModel extends IUser, Document {

}
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  xApiKey: { type: String, required: true },
  devOpsDisplayName: { type: String, required: true },
  pat: { type: String, required: true },
  devOpsUsername: { type: String, required: true },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    }
  ]
}, {
  timestamps: true,
})

export default mongoose.model<IUserModel>("User", userSchema);