import config from '../config/auth.config';
import db from '../models/index';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { serverError } from './helpers';

const User = db.user;
const Role = db.role;
const signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save((err, user) => {
    if (err) serverError(err, res);
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) serverError(err, res);
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) serverError(err, res);
            res.send({ 
              user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: roles.map(role => role.name)
            }
          });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) serverError(err, res);
        user.roles = [role._id];
        user.save(err => {
          if (err) serverError(err, res);
          res.send({ user: {
            username: user.username,
            email: user.email,
            roles: [role.name]
          }});
        });
      });
    }
  });
};
const signin = (req, res) => {
  console.log(req)
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) serverError(err, res);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
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

      var token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
      }, config, {
        expiresIn: 7200  // 2 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

export { signin, signup };