import { Request, Response } from "express";
import { createToken } from "../../middlewares/createToken";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserRepository } from "../../repositories/user/UserRepository";

const ROLE = process.env.USER_ROLE;

interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req: Request, res: Response) {
    const { role, firstName, lastName, phone, email, password } = req.body;

    if (role && role !== ROLE) {
      return res
        .status(401)
        .json({ message: "Não foi possível prosseguir com essa operação." });
    }

    if (!firstName || !lastName || !phone || !email || !password) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos antes de continuar." });
    }

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
        role,
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

      createToken(user.id, user.role, res);

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

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos antes de continuar." });
    }

    const dbUser = await this.userRepository.checkUserByEmail({ email });

    if (!dbUser) {
      return res.status(500).json({
        mesasge: "E-mail ou senha inválidos.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
      return res.status(401).json({
        mesasge: "E-mail ou senha inválidos.",
      });
    }

    try {
      await this.userRepository.signIn({ email });

      createToken(dbUser.id, dbUser.role, res);

      return res.status(201).json({
        message: "Usuário logado com sucesso.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        mesasge: "Algo de errado aconteceu, tente novamente mais tarde. 2",
      });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.getUsers();

      if (users && users.length <= 0) {
        return res.status(404).json({
          mesasge: "Nenhum usuário foi encontrado.",
        });
      }

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({
        mesasge: "Algo de errado aconteceu, tente novamente mais tarde.",
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "O id do usuário não foi fornecido." });
    }

    try {
      const user = await this.userRepository.getUserById(id);

      if (user === null) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        mesasge: "Algo de errado aconteceu, tente novamente mais tarde.",
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;
    const { firstName, lastName, phone, email } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "O id do usuário não foi fornecido." });
    }

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Informações do usuário não atualizadas." });
    }

    if (
      !validator.isLength(firstName, { min: 3 }) ||
      !validator.isLength(lastName, { min: 3 })
    ) {
      return res.status(400).json({ message: "Nome ou sobrenome inválidos." });
    }

    if (email) {
      return res
        .status(401)
        .json({ message: "Não é possível atualizar o e-mail." });
    }

    if (phone) {
      return res
        .status(401)
        .json({ message: "Não é possível atualizar o número de telefone." });
    }

    if (userId !== id && userRole !== ROLE) {
      return res
        .status(401)
        .json({ message: "Você não tem permissão para atualizar esta conta." });
    }

    if (userRole === ROLE) {
      const userToUpdate = await this.userRepository.getUserById(id);
      if (!userToUpdate) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      if (userToUpdate.role === ROLE) {
        return res.status(401).json({
          message:
            "Os administradores não podem atualizar outras contas de administradores.",
        });
      }
    }

    try {
      const user = await this.userRepository.updateUser(id, {
        firstName,
        lastName,
      });

      if (!user) {
        return res.status(500).json({
          message: "Algo de errado aconteceu, tente novamente mais tarde.",
        });
      }

      return res.status(200).json({
        message: "Informações do usuário atualizadas com sucesso.",
        user,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Algo de errado aconteceu, tente novamente mais tarde.",
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!id) {
      return res
        .status(400)
        .json({ message: "O id do usuário não foi fornecido." });
    }

    if (userId !== id && userRole !== ROLE) {
      return res
        .status(401)
        .json({ message: "Você não tem permissão para excluir esta conta." });
    }

    if (userRole === ROLE) {
      const userToDelete = await this.userRepository.getUserById(id);
      if (!userToDelete) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      if (userToDelete.role === ROLE) {
        return res.status(401).json({
          message:
            "Os administradores não podem excluir outras contas de administradores.",
        });
      }
    }

    try {
      await this.userRepository.deleteUser(id);

      res.clearCookie("token");
      return res.status(200).json({ message: "Usuário apagado com sucesso." });
    } catch (error) {
      return res.status(500).json({
        message: "Algo de errado aconteceu, tente novamente mais tarde.",
      });
    }
  }
}
