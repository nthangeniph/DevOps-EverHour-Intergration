import jwt from 'jsonwebtoken';
import config from '../config/auth.config';
import User from "../models/user.model";

export const getEverHourUserId = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
        let userDetails;
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        jwt.verify(token, config, async (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }

            await User.findOne({ '_id': decoded.id })
                .then(user => {
                    if (user) {
                        userDetails = {
                            id: user._id,
                            xApiKey: user.xApiKey

                        }
                    }
                }
                )
            req.body.xApiKey = userDetails.xApiKey;
            next();
        });

    } catch (error) {
        console.log('something went wrong')
    }
}
