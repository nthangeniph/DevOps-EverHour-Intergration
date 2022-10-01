
import Account from '../models/account.model';
import { Request, Response, NextFunction } from 'express';
import { IUserOut } from '../models/user.model';


const createAccount = (req: Request, res: Response, next: NextFunction) => {
    const { pat, devOpkey, user, everhourkey, userId } = req.body;
    const account = new Account({ pat, devOpkey, user, everhourkey });
    return account
        .save()
        .then(account => res.status(201).json({ account }))
        .catch((error) => res.status(500).json({ error }))
}
const getAllAccounts = (req: Request, res: Response, next: NextFunction) => {
    return Account.find()
        .populate("user")
        .exec()
        .then(accounts => accounts ? res.status(200).json({
            accounts: accounts.map(acc => ({
                id: acc._id,
                pat: acc.pat,
                devOpkey: acc.devOpkey,
                everhourkey: acc.everhourkey,
                accountHolder: (acc.user as IUserOut).username,
                userId: (acc.user as IUserOut)._id
            }))
        }) : res.status(404).json({ message: 'No Account found' }))
        .catch((error) => res.status(500).json({ error }))
}
const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    var query = { 'user': req.params.id };

    return Account.findOneAndUpdate(
        query,
        { $set: { ...req.body } },
        { new: true }
    )
        .populate("user")
        .exec()
        .then((account) => {
            if (account) {
                res.status(201).json({
                    account: {
                        id: account._id,
                        pat: account.pat,
                        devOpkey: account.devOpkey,
                        everhourkey: account.everhourkey,
                        accountHolder: (account.user as IUserOut).username,
                        userId: (account.user as IUserOut)._id
                    }
                })
            } else {
                res.status(404).json({ message: 'No Account found' })
            }
        })
        .catch((error) => res.status(500).json({ error }))

}
const getAccountById = async (req: Request, res: Response, next: NextFunction) => {
    var query = { 'user': req.params.userId };


    return Account.findOne({
        query
    })
        .populate("user")
        .exec()
        .then(account => account ? res.status(200).json({
            account: {
                id: account._id,
                pat: account.pat,
                devOpkey: account.devOpkey,
                everhourkey: account.everhourkey,
                accountHolder: (account.user as IUserOut).username,
                userId: (account.user as IUserOut)._id
            }
        }) : res.status(404).json({ message: 'Not found' })
        ).catch((error) => res.status(500).json({ error }))

}
const deleteAccountById = async (req: Request, res: Response, next: NextFunction) => {
    var query = { 'user': req.params.userId };

    return Account.findOneAndDelete(query)
        .then(() => res.status(201).json({ message: "Account deleted successfully" }))
        .catch((error) => res.status(500).json({ error }))


}
export {
    getAllAccounts,
    createAccount,
    updateAccount,
    getAccountById,
    deleteAccountById
}