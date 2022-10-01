import db from '../models/index';


const Account=db.account;
const checkAccountExisted=(req,res,next)=>{
    var query = { 'user': req.params.userId };

        Account.findOne({
            query
        }).exec((err, acc) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!acc) {
            res.status(404).send({ message: "Failed! Account is already in deleted!" });
            return;
          }
          next();
        });
  
      

}



export {checkAccountExisted};