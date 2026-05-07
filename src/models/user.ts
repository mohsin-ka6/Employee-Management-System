export type UserRole = "admin" | "manager" | "staff";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}
