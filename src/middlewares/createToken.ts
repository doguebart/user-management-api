import { Response } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "SECRET";

export const createToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true });
};
