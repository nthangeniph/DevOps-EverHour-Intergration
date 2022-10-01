import mongoose, { Document, Schema } from 'mongoose';


export interface IRole {
  name?: String;
}
export interface IRoleOut {
  _id?: String;
  name?: String;
}

export interface IRoleModel extends IRole, Document {

}
const Role = mongoose.model<IRoleModel>(
  "Role",
  new mongoose.Schema({
    name: String
  })
);
export default Role;