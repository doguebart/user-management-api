import { prisma } from "../../database/db";
import { ICheckUser, ICreateUserParams } from "./protocols";

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
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
      },
    });
  }
}
