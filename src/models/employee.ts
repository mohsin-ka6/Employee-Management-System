export interface Employee {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  hireDate: string;
  status: "active" | "inactive";
}
