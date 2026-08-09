import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'sr-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      <div class="toast" *ngFor="let t of toastService.toasts()" [class]="t.kind">
        <span class="icon" aria-hidden="true">{{ icon(t.kind) }}</span>
        <div class="body">
          <p class="title">{{ t.title }}</p>
          <p class="message" *ngIf="t.message">{{ t.message }}</p>
        </div>
        <button class="close" (click)="toastService.dismiss(t.id)" aria-label="Dismiss">×</button>
      </div>
    </div>
  `,
  styleUrl: './toast-host.component.scss'
})
export class ToastHostComponent {
  toastService = inject(ToastService);

  icon(kind: string): string {
    return kind === 'success' ? '✓' : kind === 'error' ? '!' : '·';
  }
}
