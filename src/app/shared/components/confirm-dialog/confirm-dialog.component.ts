import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'sr-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="overlay" *ngIf="open" (click)="cancel.emit()">
      <div class="panel perforated" (click)="$event.stopPropagation()">
        <p class="eyebrow mono">CONFIRM ACTION</p>
        <h3>{{ title }}</h3>
        <p class="message">{{ message }}</p>
        <div class="actions">
          <sr-button variant="ghost" (click)="cancel.emit()">Cancel</sr-button>
          <sr-button variant="danger" [loading]="loading" (click)="confirm.emit()">{{ confirmLabel }}</sr-button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Are you sure?';
  @Input() message = '';
  @Input() confirmLabel = 'Confirm';
  @Input() loading = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
