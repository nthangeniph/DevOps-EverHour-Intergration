const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  devOpkey: { type: String, required: true },
  everhourkey: { type: String, required: true },
}, {
  timestamps: true,
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
