import { prisma } from "../../database/db";
import {
  ICheckUser,
  ICreateUserParams,
  IUpdateUserParams,
} from "../../interfaces/user";

export class UserRepository {
  async checkUserByEmail(params: ICheckUser) {
    return await prisma.user.findUnique({ where: { email: params.email } });
  }

  async checkUserByPhone(params: ICheckUser) {
    return await prisma.user.findUnique({ where: { phone: params.phone } });
  }

  async createUser(params: ICreateUserParams) {
    return await prisma.user.create({
      data: {
        role: params.role,
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone,
        email: params.email,
        password: params.password,
      },
    });
  }

  async getUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
      },
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
      },
    });
  }

  async updateUser(id: string, params: IUpdateUserParams) {
    return await prisma.user.update({
      where: { id },
      data: {
        firstName: params.firstName,
        lastName: params.lastName,
      },
      select: {
        firstName: true,
        lastName: true,
      },
    });
  }

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
