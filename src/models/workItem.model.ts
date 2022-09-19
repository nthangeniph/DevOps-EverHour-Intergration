import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const workItemSchema = new Schema({
  title: { type: String, required: true },
  time: { type: Number, required: true },
  status: { type: Number, required: true },
  WorkItemNumber: { type: String, required: true },
  date: { type: Date, required: true },
  type:{type:String,required:true},
  user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
  

}, {
  timestamps: true,
});

 const WorkItem = mongoose.model('WorkItem', workItemSchema);
 export default WorkItem;