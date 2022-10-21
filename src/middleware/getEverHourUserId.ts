import jwt from 'jsonwebtoken';
import config from '../config/auth.config';
import Account from "../models/account.model";

export const getEverHourUserId = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
        let accountDetails;
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        jwt.verify(token, config, async (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }

            await Account.findOne({ 'user': decoded.id })
                .then(account => {
                    if (account) {
                        accountDetails = {
                            id: account._id,
                            xApiKey: account.xApiKey

                        }
                    }
                }
                )
            req.body.xApiKey = accountDetails.xApiKey;
            next();
        });

    } catch (error) {
        console.log('something went wrong')
    }
}
