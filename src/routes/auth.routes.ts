import verifySignUp from '../middleware/verifySignUp';
import { getSchema, signin, signup, updateUser } from '../controllers/auth.controller'
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const authRoute = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      ValidateSchema(Schemas.user.create)
    ],
    signup
  );
  app.post("/api/auth/signin", signin);
  app.put("/api/auth/update/:id", updateUser)
  app.get("/api/auth", getSchema)
};

export default authRoute;