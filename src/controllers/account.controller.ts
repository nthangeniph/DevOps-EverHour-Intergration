
import db from '../models/index';
import { serverError } from './helpers';
const Account = db.account;

const createAccount = (req, res) => {
    const account = new Account({
        pat: req.body.pat,
        devOpkey: req.body.devOpkey,
        user: req.body.user,
        everhourkey: req.body.everhourkey,
    });
    account.save((err, user) => {
        if (err) serverError(err, res);
        if (user._id) {

            res.status(200).send({ message: 'new account was created successfully' })
        }
    })
}
const getAllAccounts = (req, res) => {
    Account.find()
        .populate("user")
        .exec((err, accs) => {
            if (err) serverError(err, res);

            res.status(200).send(accs)
        })
}

export { getAllAccounts,createAccount }