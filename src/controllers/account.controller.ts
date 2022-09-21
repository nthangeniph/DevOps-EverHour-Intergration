
import db from '../models/index';
import { serverError } from './helpers';
const Account = db.account;

const createAccount = (req, res) => {
    const account = new Account({
        pat: req.body.pat,
        devOpkey: req.body.devOpkey,
        user: req.body.userId,
        everhourkey: req.body.everhourkey,
    });
    account.save((err, user) => {
        if (err) serverError(err, res);
        if (user._id) {

            res.status(200).send({
                accountDetails: user
            })
        }
    })
}
const getAllAccounts = (req, res) => {
    Account.find()
        .populate("user")
        .exec((err, accs) => {
            if (err) serverError(err, res);
            let filteredAccs = accs.map(acc => ({
                id: acc._id,
                pat: acc.pat,
                devOpkey: acc.devOpkey,
                everhourkey: acc.everhourkey,
                accountHolder: acc.user.username,
                userId: acc.user._id
            }))
            res.status(200).send(filteredAccs)
        })
}
const updateAccount = async (req, res) => {
    var query = { 'user': req.params.id };
    try {

        const updated = await Account.findOneAndUpdate(
            query,
            { $set: { ...req.body } },
            { new: true }
        )
            .exec();

        if (updated._id) {
            Account.findOne({
                _id: updated._id
            })
                .populate("user")
                .exec((err, acc) => {
                    if (err) serverError(err, res);
                    if (acc) {
                        res.status(200).send({
                            account: {
                                id: acc._id,
                                pat: acc.pat,
                                devOpkey: acc.devOpkey,
                                everhourkey: acc.everhourkey,
                                accountHolder: acc.user.username,
                                userId: acc.user._id
                            }
                        });
                        return;
                    }

                })


        }


    } catch (error: any) {
        if (error) serverError(error, res);
    }

}
const getAccountById = async (req, res) => {
    var query = { 'user': req.params.userId };
    try {

        Account.findOne({
            query
        })
            .populate("user")
            .exec((err, acc) => {
                if (err) serverError(err, res);
                if (acc) {
                    res.status(200).send({
                        account: {
                            id: acc._id,
                            pat: acc.pat,
                            devOpkey: acc.devOpkey,
                            everhourkey: acc.everhourkey,
                            accountHolder: acc.user.username,
                            userId: acc.user._id
                        }
                    });
                    return;
                }

            })

    } catch (error: any) {
        if (error) serverError(error, res);
    }
}
const deleteAccountById = async (req, res) => {
    var query = { 'user': req.params.userId };
    try {
        Account.findOneAndDelete(query, (err, acc) => {
            console.log('res', acc);
            res.status(200).send({ message: "Account deleted successfully" })
            return;
        })

    } catch (error: any) {
        if (error) serverError(error, res);
    }

}
export {
    getAllAccounts,
    createAccount,
    updateAccount,
    getAccountById,
    deleteAccountById
}