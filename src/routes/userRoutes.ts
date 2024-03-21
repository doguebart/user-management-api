import express, { Response, Request } from "express";
import { UserController } from "../controllers/user/UserController";
import { verifyToken } from "../middlewares/verifyToken";

interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const userRouter = express.Router();
userRouter.use(express.json());
const userController = new UserController();

userRouter.post("/register", userController.signUp.bind(userController));
userRouter.post("/login", userController.signIn.bind(userController));
userRouter.post("/logout", verifyToken, (req: Request, res: Response) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Usuário desconectado com sucesso." });
});
userRouter.get(
  "/protected",
  verifyToken,
  (req: AuthenticatedRequest, res: Response) => {
    return res
      .status(200)
      .json({ user: { id: req.userId, role: req.userRole } });
  }
);
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
