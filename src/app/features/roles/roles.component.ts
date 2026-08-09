import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { extractApiError } from '../../core/utils/api-error';
import { Role } from '../../core/models/role.model';
import { RoleService } from '../../core/services/role.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'sr-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BadgeComponent, ButtonComponent, InputComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private toast = inject(ToastService);

  loading = signal(true);
  saving = signal(false);
  deleting = signal(false);

  roles = signal<Role[]>([]);
  editingRole = signal<Role | null>(null);
  formOpen = signal(false);
  roleToDelete = signal<Role | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
  });

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles ?? []);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.toast.error('Could not load roles', extractApiError(err));
      }
    });
  }

  openCreate(): void {
    this.editingRole.set(null);
    this.form.reset({ name: '' });
    this.formOpen.set(true);
  }

  openEdit(role: Role): void {
    this.editingRole.set(role);
    this.form.reset({ name: role.name });
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = this.form.getRawValue();
    const editing = this.editingRole();

    const req = editing ? this.roleService.updateRole(editing.id, payload) : this.roleService.createRole(payload);

    req.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.toast.success(editing ? 'Role updated' : 'Role stamped', editing ? undefined : `"${payload.name}" is now on file.`);
        this.formOpen.set(false);
        this.fetch();
      },
      error: (err: HttpErrorResponse) => this.toast.error('Could not save role', extractApiError(err))
    });
  }

  confirmDelete(role: Role): void {
    this.roleToDelete.set(role);
  }

  cancelDelete(): void {
    this.roleToDelete.set(null);
  }

  performDelete(): void {
    const role = this.roleToDelete();
    if (!role) return;
    this.deleting.set(true);
    this.roleService
      .deleteRole(role.id)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Role revoked', `"${role.name}" was removed from file.`);
          this.roleToDelete.set(null);
          this.fetch();
        },
        error: (err: HttpErrorResponse) => this.toast.error('Could not delete role', extractApiError(err))
      });
  }
}
