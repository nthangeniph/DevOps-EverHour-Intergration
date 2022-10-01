import db from '../models/index';
import {ObjectId} from 'mongodb';
import { validEntityId } from './helpers';
import { serverError } from '../controllers/helpers';


const Configuration=db.configuration;
const User=db.user;
const checkConfigExisted=(req,res,next)=>{
    var query = { 'userId': req.params.userId };

    Configuration.findOne({
            query
        }).exec((err, config) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!config) {
            res.status(404).send({ message: "Failed! Account is already in deleted!" });
            return;
          }
          next();
        });
  
      

}
const checkConfigNew=(req,res,next)=>{

  try{
    var query = { _id :validEntityId(req.body.userId) };
 
    User.findOne(
            query
        ).exec((err, user) => {
         
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!user) {
            res.status(404).send({ message: "Failed! There is no such user in the system!" });
            return;
          }
          next();
        });
  }catch (error: any) {
    if (error) serverError(error, res);
  }


    

}
const checkUserExist=(req,res,next)=>{
  var query = { userId: req.body.userId };
  Configuration.findOne(
          query
      ).exec((err, config) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (config) {
          res.status(208).send({ message: "Failed! Config associated with this user  already exist!" });
          return;
        }
        next();
      });

    

}



export {checkConfigExisted,checkConfigNew,checkUserExist};