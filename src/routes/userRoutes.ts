import express from "express";
import { UserController } from "../controllers/user/UserController";

export const userRouter = express.Router();
userRouter.use(express.json());
const userController = new UserController();

userRouter.post("/register", userController.signUp.bind(userController));
userRouter.get("/", userController.getUsers.bind(userController));
userRouter.patch("/:id", userController.update.bind(userController));
