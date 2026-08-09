import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RoleService } from '../../core/services/role.service';
import { Role, UserWithRoles } from '../../core/models/role.model';
import { ClearanceBadgeComponent } from '../../shared/components/clearance-badge/clearance-badge.component';

@Component({
  selector: 'sr-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ClearanceBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  auth = inject(AuthService);
  private roleService = inject(RoleService);

  loading = signal(true);
  roles = signal<Role[]>([]);
  users = signal<UserWithRoles[]>([]);

  constructor() {
    forkJoin({
      roles: this.roleService.getRoles(),
      users: this.roleService.getUsersWithRoles()
    }).subscribe({
      next: ({ roles, users }) => {
        this.roles.set(roles ?? []);
        this.users.set(users ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  get unassignedCount(): number {
    return this.users().filter((u) => !u.roles || u.roles.length === 0).length;
  }
}
