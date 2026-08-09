import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sr-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="sr-btn"
      [class]="variant"
      [type]="type"
      [disabled]="disabled || loading"
    >
      <span class="spinner" *ngIf="loading" aria-hidden="true"></span>
      <span class="label" [class.hidden]="loading"><ng-content /></span>
    </button>
  `,
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'ghost' | 'danger' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
}
