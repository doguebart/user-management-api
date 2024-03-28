import { Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
const SECRET = process.env.SECRET || "SECRET";

export const createToken = (
  userId: string,
  userRole: string,
  res: Response
) => {
  const token = jwt.sign({ userId, userRole }, SECRET, { expiresIn: "48h" });
  res.cookie("token", token, { httpOnly: true, secure: true });
};
