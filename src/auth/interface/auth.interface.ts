export interface IUser {
  user_id: number;
  user_nm: string;
  email: string;
  password: string;
  role_id: number;
  is_active: boolean;
}

export interface IUserNew extends Omit<IUser, "user_id"> {}
export interface IUserUpdate extends Partial<IUserNew> {}
