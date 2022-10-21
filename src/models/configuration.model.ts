
import mongoose, { Document, Schema } from 'mongoose';

export interface IConfig {
  projects?: Array<String>;
  companyname?: String;
  userId?: String;
  states?: Array<String>;
  dateFrom?: String;
  dateTo?: String;

}

export interface IConfigModel extends IConfig, Document {

}

const configurationSchema = new Schema({
  projects: [{ type: String, required: true }],
  companyname: { type: String, required: true },
  userId: { type: String, required: true },
  states: [{ type: String }],
  dateFrom: { type: String },
  dateTo: { type: String },
}, {
  timestamps: true,
});

const Configuration = mongoose.model<IConfigModel>('Configuration', configurationSchema);
export default Configuration;
