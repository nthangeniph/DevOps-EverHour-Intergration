"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.signup = exports.signin = void 0;
const auth_config_1 = __importDefault(require("../config/auth.config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const role_model_1 = __importDefault(require("../models/role.model"));
const signup = async (req, res, next) => {
    console.log("signup");
    const { username, password } = req.body;
    const roles = await getRoles(req.body.roles, res);
    console.log("signup", roles);
    const user = new user_model_1.default({ username, password: bcryptjs_1.default.hashSync(password, 8), roles: roles.map(rol => rol._id) });
    return user.save()
        .then(user => res.status(201).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.username,
            roles: roles.map(role => role.name)
        }
    }))
        .catch((error) => res.status(500).json({ error }));
};
exports.signup = signup;
const signin = (req, res, next) => {
    user_model_1.default.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec()
        .then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }
        var passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
            //@ts-ignore  please make good use of typescript here
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        var token = jsonwebtoken_1.default.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
        }, auth_config_1.default, {
            expiresIn: 36000 // 4 hours
        });
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.username,
            roles: authorities,
            accessToken: token
        });
    });
};
exports.signin = signin;
const updateUser = async (req, res, next) => {
    var query = { '_id': req.params.id };
    if (!!req.body.roles) {
        req.body.roles = (await getRoles(req.body.roles, res)).map(rl => rl._id);
    }
    user_model_1.default.findOneAndUpdate(query, { $set: { ...req.body } }, { new: true })
        .populate("roles")
        .exec()
        .then(user => user ?
        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles.map(role => role.name)
            }
        }) : res.status(404).json({ message: 'No User found' }))
        .catch((error) => res.status(500).json({ error }));
};
exports.updateUser = updateUser;
async function getRoles(roles = [], res) {
    let results = [];
    if (roles.length) {
        await role_model_1.default.find({ name: { $in: roles } })
            .then((roles) => {
            results = roles;
        })
            .catch((error) => {
            res.status(500).json({ error });
        });
    }
    else {
        await role_model_1.default.find({ name: "user" })
            .then((role) => {
            results = role;
        })
            .catch((error) => {
            res.status(500).json({ error });
        });
    }
    return results;
}
