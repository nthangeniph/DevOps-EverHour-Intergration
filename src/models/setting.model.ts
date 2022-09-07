
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  projects: { type: String, required: true },
  displayname: { type: String, required: true },
  consent: { type: Number, required: true },
  companyname: { type: String, required: true },
  account:{
    type:Schema.Types.ObjectId,
    ref:'Account',
    required:true
  }
}, {
  timestamps: true,
});

 const Setting = mongoose.model('Setting', settingSchema);
 export default Setting;
