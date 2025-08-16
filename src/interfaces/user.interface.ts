export interface UserInterface {
  id: number;
  name: string;
  email: string;
  mobile: string;
  password?: string; // Optional, as it may not be needed in all contexts
  type?: string; // Optional, for user roles or types
  createdAt?: Date; // Optional, for tracking creation time
  updatedAt?: Date; // Optional, for tracking last update time
}
