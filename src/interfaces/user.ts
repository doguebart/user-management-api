export interface ICheckUser {
  email?: string;
  phone?: string;
}

export interface IVerifyUserToken {
  userId: string;
  userRole: string;
}

export interface ICreateUserParams {
  id?: string;
  role?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
}

export interface IUpdateUserParams {
  firstName?: string;
  lastName?: string;
}
