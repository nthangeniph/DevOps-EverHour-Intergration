import jwt from 'jsonwebtoken';
import db from '../models/index';
import config from '../config/auth.config';

const User = db.user;
const Role = db.role;
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.body.userId = decoded.id;
    req.body.devOpsDisplayName = decoded.devOpsDisplayName;
    req.body.devOpsUsername = decoded.devOpsUsername;
    req.body.pat = decoded.pat;
    req.body.xApiKey = decoded.xApiKey;



    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};
const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
export default authJwt;