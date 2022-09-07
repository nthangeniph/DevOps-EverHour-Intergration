import mongoose from 'mongoose';
import user from './user.model';
import role from './role.model';
import setting from './setting.model';
import workItem from './workItem.model';
mongoose.Promise = global.Promise;
const db = {} as any ;
//@ts-ignore
db.mongoose = mongoose;
db.user=user;
db.role=role;
db.setting=setting;
db.workItem=workItem;



 db.ROLES = ["user", "admin", "moderator"];


export default db;