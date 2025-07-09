export type User = {
  id: string;
  email: string;
  role: "admin" | "church_admin" | "user";
  church?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
