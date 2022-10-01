import mongoose from 'mongoose';
import user from './user.model';
import role from './role.model';
import account from './account.model';
import configuration from './configuration.model';
import workItem from './workItem.model';
mongoose.Promise = global.Promise;
const db = {} as any ;
//@ts-ignore
db.mongoose = mongoose;
db.user=user;
db.role=role;
db.account=account;
db.configuration=configuration;
db.workItem=workItem;



 db.ROLES = ["user", "admin", "moderator"];


export default db;