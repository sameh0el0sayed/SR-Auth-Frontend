import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthUser } from '../../../core/models/auth.model';

@Component({
  selector: 'sr-clearance-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="badge-card perforated" [class.compact]="compact">
      <div class="foil"></div>
      <div class="badge-top">
        <span class="agency mono">SR · AUTH</span>
        <span class="status mono"><span class="pulse"></span>ACTIVE</span>
      </div>
      <div class="badge-body">
        <div class="monogram">{{ initials }}</div>
        <div class="who">
          <p class="name">{{ user?.username || 'Unnamed holder' }}</p>
          <p class="email mono">{{ user?.email || '—' }}</p>
        </div>
      </div>
      <div class="badge-bottom">
        <span class="uid mono">ID·{{ shortId }}</span>
        <span class="roles" *ngIf="user?.roles?.length as n; else noRoles">{{ n }} role{{ n === 1 ? '' : 's' }}</span>
        <ng-template #noRoles><span class="roles">unassigned</span></ng-template>
      </div>
    </div>
  `,
  styleUrl: './clearance-badge.component.scss'
})
export class ClearanceBadgeComponent {
  @Input() user: AuthUser | null = null;
  @Input() initials = '??';
  @Input() compact = false;

  get shortId(): string {
    const id = this.user?.id ?? '';
    return id ? id.slice(0, 8) : '········';
  }
}
