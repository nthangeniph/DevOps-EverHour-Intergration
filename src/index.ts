import db from './models/index';
import userRoute from './routes/user.routes';
import authRoute from './routes/auth.routes';
import express from "express";
import {devopsHeaders} from './utils/index';
import swaggerDocument from '../swagger.json';
import combinedJson from './swagger';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';



import cors from 'cors';
import { accRoute } from './routes/acc.routes';
import { devOpsRoute } from './routes/devOps.routes';
const app = express();
const fetch=require('node-fetch')
var dburl = 'mongodb+srv://Nthangeniph:1234Univen@cluster0.hg4c5zm.mongodb.net/?retryWrites=true&w=majority';
var whitelist = ['http://localhost:8080','https://localhost:8080', 'http://example2.com']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

//this will enable cors for all whitelisted sites
app.use(cors(corsOptions));
app.use(cors())
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({
    extended: true
  }));
db.mongoose
    .connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


//connect the routes to the server
userRoute(app);
authRoute(app);
accRoute(app)
devOpsRoute(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup({...swaggerDocument,...combinedJson})
  );
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
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


