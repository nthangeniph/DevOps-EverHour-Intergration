import joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import Logging from '../library/Logging';
import { IAccount } from '../models/account.model';
import { IConfig } from '../models/configuration.model';
import { IUser } from '../models/user.model';
import Joi from 'joi';
import { IWeekTasksInput } from '../models/task.model';


export const ValidateSchema = (Schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Schema.validateAsync(req.body, { abortEarly: false });

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    }
}

export const Schemas = {
    account: {
        create: joi.object<IAccount>({
            devOpsDisplayName: joi.string().required(),
            devOpsUsername: joi.string().required(),
            xApiKey: joi.string().required(),
            pat: joi.string().required(),
            user: joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        }),
        update: joi.object<IAccount>({
        })
    },
    configuration: {
        create: joi.object<IConfig>({
            companyname: joi.string().required(),
            projects: joi.array().required(),
            states: joi.array().required(),
            dateFrom: joi.string().required(),
            dateTo: joi.string().required(),
            userId: joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required()
        }),
        update: joi.object<IConfig>({
            userId: joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        })

    },
    user: {
        create: joi.object<IUser>({
            username: joi.string().required(),
            password: Joi.string().min(6).required(),
            roles: joi.array(),


        }),
        signin: joi.object<IUser>({
            username: joi.string().required,
            password: Joi.string().min(6).required(),
        })
    },
    everHour: {
        getWeekTasks: joi.object<IWeekTasksInput>({

        })

    }
}

