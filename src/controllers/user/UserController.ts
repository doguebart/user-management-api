import { Request, Response } from "express";
import { createToken } from "../../middlewares/createToken";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserRepository } from "../../repositories/user/UserRepository";

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req: Request, res: Response) {
    const { firstName, lastName, phone, email, password } = req.body;

    if (
      !validator.isLength(firstName, { min: 3 }) ||
      !validator.isLength(lastName, { min: 3 })
    ) {
      return res.status(400).json({ message: "Nome ou sobrenome inválidos." });
    }

    if (
      !validator.isLength(phone, { min: 11, max: 11 }) ||
      !validator.isMobilePhone(phone, "pt-BR", {
        strictMode: false,
      })
    ) {
      return res.status(400).json({ message: "Número de telefone inválido." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "E-mail inválido." });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ message: "A senha deve ter no mínimo 6 caractéres." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkIfUserExistByEmail = await this.userRepository.checkUserByEmail({
      email,
    });

    const checkIfUserExistByPhone = await this.userRepository.checkUserByPhone({
      phone,
    });

    if (checkIfUserExistByEmail) {
      return res.status(400).json({
        message: "Este e-mail já está em uso.",
      });
    }

    if (checkIfUserExistByPhone) {
      return res.status(400).json({
        message: "Este número de telefone já está em uso.",
      });
    }

    try {
      const user = await this.userRepository.createUser({
        firstName,
        lastName,
        phone,
        email,
        password: hashedPassword,
      });

      if (!user) {
        return res.status(500).json({
          message: "Algo de errado aconteceu, tente novamente mais tarde.",
        });
      }

      createToken(user.id, res);

      return res.status(201).json({
        message: "Usuário criado com sucesso.",
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Algo de errado aconteceu, tente novamente mais tarde.",
      });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.getUsers();

      return res.status(200).json([users]);
    } catch (error) {
      return res.status(500).json({
        mesasge: "Algo de errado aconteceu, tente novamente mais tarde",
      });
    }
  }
}
