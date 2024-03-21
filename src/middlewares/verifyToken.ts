import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IVerifyUserToken } from "../interfaces/user";
import { config } from "dotenv";

interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

config();
const SECRET = process.env.SECRET || "SECRET";

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "O token não foi fornecido." });
  }

  jwt.verify(token, SECRET, (err: unknown, decoded: unknown) => {
    if (err) {
      console.log(err);
      return res
        .status(403)
        .json({ message: "Falha na autenticação do token." });
    }
    const decodedToken = decoded as IVerifyUserToken;
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.userRole;
    next();
  });
};
