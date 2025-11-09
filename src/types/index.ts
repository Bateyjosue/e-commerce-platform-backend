
export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  img?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
