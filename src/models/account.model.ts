const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  username: { type: String, required: true },
  pat: { type: String, required: true },
  devOpkey: { type: String, required: true },
  everhourkey: { type: String, required: true },
  user:   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  
  
}, {
  timestamps: true,
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
