import { Response } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "SECRET";

export const createToken = (
  userId: string,
  userRole: string,
  res: Response
) => {
  const token = jwt.sign({ userId, userRole }, SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true });
};
