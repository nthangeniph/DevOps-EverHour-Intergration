import Configuration from '../models/configuration.model';
import { NextFunction, Request, Response } from 'express';
import swaggerDocs from "../swagger/configuration.json"

const createConfig = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    const configuration = new Configuration({
        userId,
        ...req.body
    }
    );

    return configuration
        .save()
        .then((config) => res.status(201).json({ config }))
        .catch((error) => res.status(500).json({ error }));
};

const getConfiguration = (req: Request, res: Response, next: NextFunction) => {
    var query = { userId: req.query.userId };


    return Configuration.findOne(query)
        .then((config) =>
            config
                ? res.status(200).json({
                    configuration: {
                        id: config._id,
                        userId: config.userId,
                        companyname: config.companyname,
                        projects: config.projects,
                        states: config.states,
                        dateFrom: config.dateFrom,
                        dateTo: config.dateTo
                    }
                })
                : res.status(404).json({ message: 'Not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const updateConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var query = { userId: req.body.userId };
        console.log("query ::", query);

        return Configuration.findOneAndUpdate(query, { $set: { ...req.body } }, { new: true })
            .exec()
            .then((config) => {
                if (config) {
                    res.status(201).json({
                        configuration: {
                            id: config._id,
                            userId: config.userId,
                            projects: config.projects,
                            states: config.states,
                            dateFrom: config.dateFrom,
                            dateTo: config.dateTo
                        }
                    });
                }
            })
            .catch((error) => res.status(500).json({ error }));
    } catch (error) {
        console.log(error);
    }
};

const deleteConfigById = async (req: Request, res: Response, next: NextFunction) => {
    var query = { user: req.params.userId };

    return Configuration.findOneAndDelete(query)
        .then(() => res.status(200).send({ message: 'Configuration deleted successfully' }))
        .catch((error) => res.status(500).json({ error }));
};
const getSchema = async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);

}
export { createConfig, getConfiguration, updateConfig, deleteConfigById, getSchema };
