import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role, RoleRequest, UserRoleRequest, UserWithRoles } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly base = `${environment.apiUrl}/sr/api/role`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.base}/roles`);
  }

  getUsersWithRoles(): Observable<UserWithRoles[]> {
    return this.http.get<UserWithRoles[]>(`${this.base}/UsersWithRoles`);
  }

  createRole(payload: RoleRequest): Observable<Role> {
    return this.http.post<Role>(`${this.base}/create`, payload);
  }

  updateRole(roleId: string, payload: RoleRequest): Observable<Role> {
    return this.http.put<Role>(`${this.base}/${roleId}`, payload);
  }

  deleteRole(roleId: string): Observable<unknown> {
    return this.http.delete(`${this.base}/${roleId}`);
  }

  assignRole(payload: UserRoleRequest): Observable<unknown> {
    return this.http.post(`${this.base}/assign`, payload);
  }

  removeRole(payload: UserRoleRequest): Observable<unknown> {
    return this.http.post(`${this.base}/remove`, payload);
  }
}
