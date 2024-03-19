import express from "express";
import { UserController } from "../controllers/user/UserController";
import { verifyToken } from "../middlewares/verifyToken";

export const userRouter = express.Router();
userRouter.use(express.json());
const userController = new UserController();

userRouter.post("/register", userController.signUp.bind(userController));
userRouter.get("/", userController.getUsers.bind(userController));
userRouter.get("/:id", userController.getUserById.bind(userController));
userRouter.patch(
  "/:id",
  verifyToken,
  userController.update.bind(userController)
);
userRouter.delete(
  "/:id",
  verifyToken,
  userController.delete.bind(userController)
);
