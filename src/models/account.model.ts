import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  pat: { type: String, required: true },
  devOpkey: { type: String, required: true },
  everhourkey: { type: String, required: true },
  user:   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
    
  }
   
}, {
  timestamps: true,
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
