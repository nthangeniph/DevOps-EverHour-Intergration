"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDevops = void 0;
const index_1 = __importDefault(require("./models/index"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const express_1 = __importDefault(require("express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const swagger_1 = __importDefault(require("./swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const acc_routes_1 = require("./routes/acc.routes");
const devOps_routes_1 = require("./routes/devOps.routes");
const config_routes_1 = require("./routes/config.routes");
const config_1 = require("./config/config");
const Logging_1 = __importDefault(require("./library/Logging"));
const everHour_routes_1 = require("./routes/everHour.routes");
const cors_1 = __importDefault(require("cors"));
const comment_routes_1 = require("./routes/comment.routes");
const utils_1 = require("./utils");
const router = (0, express_1.default)();
var request = require('request');
mongoose_1.default
    .connect(config_1.config.mongo.url, {
    retryWrites: true,
    w: "majority"
})
    .then(() => {
    Logging_1.default.info("Successfully connect to MongoDB.");
    initial();
    StartServer();
})
    .catch(err => {
    Logging_1.default.error("Connection error");
    Logging_1.default.error(err);
    process.exit();
});
/** Only start the server if Mongo Connects */
const StartServer = () => {
    //OpenApi 
    router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup({ ...swagger_json_1.default, ...swagger_1.default }, { swaggerOptions: { persistAuthorization: true } }));
    router.use((req, res, next) => {
        /** Log the Request */
        Logging_1.default.info(`Incoming -> Method: [${req.method}] -Url :[${req.url}] -IP: [${req.
            socket.remoteAddress}] -Status: [${res.statusCode}]`);
        next();
    });
    router.use(express_1.default.json());
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    /** Rules of our API */
    // router.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    //     res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //     if (req.method == 'OPTIONS') {
    //         res.header('Access-Control-Allow-Methods', 'PUT ,POST, PATCH, DELETE, GET');
    //         return res.status(200).json({})
    //     }
    //     next();
    // });
    var whitelist = ['http://localhost:3000/*', 'http://localhost:8080',];
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    };
    //this will enable cors for all whitelisted sites
    router.use((0, cors_1.default)(corsOptions));
    /** Routes  */
    (0, user_routes_1.default)(router);
    (0, auth_routes_1.default)(router);
    (0, acc_routes_1.accRoute)(router);
    (0, devOps_routes_1.devOpsRoute)(router);
    (0, config_routes_1.configRoute)(router);
    (0, comment_routes_1.commentRoute)(router);
    (0, everHour_routes_1.everHourRoute)(router);
    /** Health Checks */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
};
updateDevops();
router.listen(config_1.config.server.port, () => {
    Logging_1.default.info(`Server is running on port ${config_1.config.server.port}.`);
    //getProjectData('zl3rt34z6eymdtzfz5sz7untamobwpg3fmdyl6uw5detdbmcxmaq','Phumudzo')
});
const Role = index_1.default.role;
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
async function updateDevops() {
    var options01 = {
        'method': 'PATCH',
        'url': 'https://dev.azure.com/boxfusion/_apis/wit/workitems/44036?api-version=6.0',
        'headers': (0, utils_1.devopsPatchHeaders)({ username: "Phumudzo", pat: 'x73u3mb2jjmty6swvz5jftjwbkuadbzke7apmusww5ytidaqj4wa' }),
        body: JSON.stringify([
            {
                op: "add",
                path: "/fields/Custom.Tracked",
                value: false,
            }
        ])
    };
    await request(options01, async function (error, response) {
        console.log("tracked :;", (JSON.parse(response.body))['fields']['Custom.Tracked']);
    });
}
exports.updateDevops = updateDevops;
