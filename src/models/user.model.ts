import mongoose, { Document, Schema } from 'mongoose';
import { IRoleOut } from './role.model';

export interface IUser {
  username?: String;
  email?: String;
  password?: String;
  roles?: Array<Schema.Types.ObjectId>;
}
export interface IUserOut {
  _id?: String;
  username?: String;
  email?: String;
  password?: String;
  roles?: Array<IRoleOut>;
}
export interface IUserModel extends IUser, Document {

}
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
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