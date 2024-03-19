import express, { Request, Response } from "express";

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Usuários resgatados com sucesso." });
});
