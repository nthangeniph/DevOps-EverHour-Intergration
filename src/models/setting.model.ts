
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const settingSchema = new Schema({
  projects:[ { type: String, required: true }],
  displayname: { type: String, required: true },
  consent: { type: Number, required: true },
  companyname: { type: String, required: true },
  user:   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
});

 const Setting = mongoose.model('Setting', settingSchema);
 export default Setting;
