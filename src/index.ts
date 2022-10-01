import db from './models/index';
import userRoute from './routes/user.routes';
import authRoute from './routes/auth.routes';
import express from "express";
import swaggerDocument from '../swagger.json';
import combinedJson from './swagger';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { accRoute } from './routes/acc.routes';
import { devOpsRoute } from './routes/devOps.routes';
import { configRoute } from './routes/config.routes';
import { everHoursHeaders } from './utils';
import { config } from './config/config';
import Logging from './library/Logging';
const router = express();


mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: "majority"
    })
    .then(() => {
        Logging.info("Successfully connect to MongoDB.");
        initial();
        StartServer();

    })
    .catch(err => {
        Logging.error("Connection error");
        Logging.error(err);
        process.exit();
    });


/** Only start the server if Mongo Connects */
const StartServer = () => {
    //OpenApi 
    router.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup({ ...swaggerDocument, ...combinedJson }, { swaggerOptions: { persistAuthorization: true } })
    );
    router.use((req, res, next) => {
        /** Log the Request */
        Logging.info(`Incoming -> Method: [${req.method}] -Url :[${req.url}] -IP: [${req.
            socket.remoteAddress}] -Status: [${res.statusCode}]`);

        next();
    })

    router.use(express.json());
    router.use(express.urlencoded({ extended: true }));
    router.use(bodyParser.urlencoded({
        extended: true
    }));

    /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT ,POST, PATCH, DELETE, GET');
            return res.status(200).json({})
        }
        next();
    });

    /** Routes  */
    userRoute(router);
    authRoute(router);
    accRoute(router)
    devOpsRoute(router);
    configRoute(router);

    /** Health Checks */
    router.get('/ping', (req, res, next) => res.status(200).json
        ({ message: 'pong' }));

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);
        return res.status(404).json({ message: error.message })
    })

}


router.listen(config.server.port, () => {
    Logging.info(`Server is running on port ${config.server.port}.`);
    //getProjectData('zl3rt34z6eymdtzfz5sz7untamobwpg3fmdyl6uw5detdbmcxmaq','Phumudzo')
});


const Role = db.role;

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'moderator' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

var request = require('request');


var options = {
    'method': 'GET',
    'url': `https://api.everhour.com/projects`,
    'headers': everHoursHeaders('0146-63cc-5847c7-079bc3-636a5cdf'),


};
request(options, function (error, response, body) {
    JSON.parse(body).filter(project => {
        return !!project.users.find(user => {
            if (user == 861229) {
                //  console.log("response  ::",project)
            }
            return user == 861229
        })

    }).splice(0, 10);
});

var optionsMe = {
    'method': 'GET',
    'url': `https://api.everhour.com/users/me`,
    'headers': everHoursHeaders('0146-63cc-5847c7-079bc3-636a5cdf'),


};
request(optionsMe, function (error, response, body) {
    console.log('Response-Me:', JSON.parse(body).id);
});