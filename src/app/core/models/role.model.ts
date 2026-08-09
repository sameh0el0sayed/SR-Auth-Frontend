export interface Role {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface RoleRequest {
  name: string;
}

export interface UserRoleRequest {
  user_id: string;
  role_id: string;
}

export interface UserWithRoles {
  id?: string;
  username?: string;
  email?: string;
  roles?: (Role | string)[];
  [key: string]: unknown;
}
