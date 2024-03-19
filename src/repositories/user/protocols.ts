export interface ICheckUser {
  email?: string;
  phone?: string;
}

export interface ICreateUserParams {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface IUpdateUserParams {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}
