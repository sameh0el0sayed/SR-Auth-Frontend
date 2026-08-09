import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sr-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty">
      <div class="mark" aria-hidden="true"></div>
      <h4>{{ title }}</h4>
      <p>{{ message }}</p>
      <ng-content />
    </div>
  `,
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() title = 'Nothing on file';
  @Input() message = '';
}
