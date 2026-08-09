import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { extractApiError } from '../../core/utils/api-error';
import { Role, UserWithRoles } from '../../core/models/role.model';
import { RoleService } from '../../core/services/role.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

function roleLabel(r: Role | string): string {
  return typeof r === 'string' ? r : r.name;
}

function roleIdOf(r: Role | string): string | null {
  return typeof r === 'string' ? null : r.id;
}

@Component({
  selector: 'sr-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BadgeComponent, ButtonComponent, EmptyStateComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private toast = inject(ToastService);

  loading = signal(true);
  busyUserId = signal<string | null>(null);
  users = signal<UserWithRoles[]>([]);
  roles = signal<Role[]>([]);
  panelUserId = signal<string | null>(null);

  panelUser = computed(() => this.users().find((u) => u.id === this.panelUserId()) ?? null);
  availableRoles = computed(() => {
    const user = this.panelUser();
    if (!user) return this.roles();
    const heldIds = new Set((user.roles ?? []).map(roleIdOf).filter(Boolean));
    const heldNames = new Set((user.roles ?? []).map(roleLabel));
    return this.roles().filter((r) => !heldIds.has(r.id) && !heldNames.has(r.name));
  });

  form = this.fb.nonNullable.group({
    roleId: ['', Validators.required]
  });

  roleLabel = roleLabel;

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    forkJoin({
      users: this.roleService.getUsersWithRoles(),
      roles: this.roleService.getRoles()
    }).subscribe({
      next: ({ users, roles }) => {
        this.users.set(users ?? []);
        this.roles.set(roles ?? []);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.toast.error('Could not load holders', extractApiError(err));
      }
    });
  }

  openPanel(user: UserWithRoles): void {
    this.panelUserId.set(user.id ?? null);
    this.form.reset({ roleId: '' });
  }

  closePanel(): void {
    this.panelUserId.set(null);
  }

  assign(): void {
    const user = this.panelUser();
    if (!user?.id || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busyUserId.set(user.id);
    this.roleService
      .assignRole({ user_id: user.id, role_id: this.form.getRawValue().roleId })
      .pipe(finalize(() => this.busyUserId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Role stamped', `Assigned to ${user.username || user.email}.`);
          this.form.reset({ roleId: '' });
          this.fetch();
        },
        error: (err: HttpErrorResponse) => this.toast.error('Could not assign role', extractApiError(err))
      });
  }

  remove(user: UserWithRoles, role: Role | string): void {
    const roleId = roleIdOf(role);
    if (!user.id || !roleId) {
      this.toast.error('Could not remove role', 'This role entry has no ID to reference.');
      return;
    }
    this.busyUserId.set(user.id);
    this.roleService
      .removeRole({ user_id: user.id, role_id: roleId })
      .pipe(finalize(() => this.busyUserId.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Role removed', `Revoked from ${user.username || user.email}.`);
          this.fetch();
        },
        error: (err: HttpErrorResponse) => this.toast.error('Could not remove role', extractApiError(err))
      });
  }
}
