import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sr-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="sr-badge" [class]="tone">
      <span class="dot" aria-hidden="true"></span>
      <ng-content />
    </span>
  `,
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() tone: 'brass' | 'teal' | 'coral' | 'muted' = 'brass';
}
