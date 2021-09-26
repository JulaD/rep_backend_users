export interface UserCreateDTO {
  name: string;
  email: string;
  password: string;
  repeat: string;
  type: number;
  status: number;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}