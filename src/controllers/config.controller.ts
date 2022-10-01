import Configuration from '../models/configuration.model';
import { NextFunction, Request, Response } from 'express';


const CreateConfig = (req: Request, res: Response, next: NextFunction) => {

    const { userId, displayname } = req.body;

    const configuration = new Configuration({
        displayname,
        userId,
        ...req.body

    });

    return configuration
        .save()
        .then(config => res.status(201).json({ config }))
        .catch((error) => res.status(500).json({ error }))

}

const getConfiguration = (req: Request, res: Response, next: NextFunction) => {
    var query = { 'user': req.params.userId };


    return Configuration.findOne(
        query
    )
        .then(account => account ? res.status(200).json({
            configuration: {
                id: account._id,
                userId: account.userId,
                companyname: account.companyname,
                displayname: account.displayname,
                projects: account.projects,
                states: account.states,
                dateFrom: account.dateFrom,
                dateTo: account.dateTo
            }
        }) : res.status(404).json({ message: 'Not found' })
        ).catch((error) => res.status(500).json({ error }))

}


const updateConfig = async (req: Request, res: Response, next: NextFunction) => {
    var query = { 'userId': req.body.userId };

    return Configuration.findOneAndUpdate(
        query,
        { $set: { ...req.body } },
        { new: true }
    )
        .exec()
        .then((config) => {
            if (config) {
                res.status(201).json({
                    configuration: {
                        id: config._id,
                        userId: config.userId,
                        displayname: config.displayname,
                        projects: config.projects,
                        states: config.states,
                        dateFrom: config.dateFrom,
                        dateTo: config.dateTo
                    }
                })

            }
        }
        )
        .catch((error) => res.status(500).json({ error }))

}

const deleteConfigById = async (req: Request, res: Response, next: NextFunction) => {
    var query = { 'user': req.params.userId };

    return Configuration.findOneAndDelete(
        query
    )
        .then(() => res.status(200).send({ message: "Configuration deleted successfully" })
        )
        .catch((error) => res.status(500).json({ error }))




}


export { CreateConfig, getConfiguration, updateConfig, deleteConfigById };