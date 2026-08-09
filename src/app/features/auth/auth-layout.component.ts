import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sr-auth-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-screen">
      <section class="manifest">
        <div class="seal-row">
          <div class="seal" aria-hidden="true">SR</div>
          <span class="mono agency">BUREAU OF ACCESS</span>
        </div>

        <h1>{{ headline }}</h1>
        <p class="lede">{{ lede }}</p>

        <ul class="ledger">
          <li>
            <span class="mono tag">TOKEN</span>
            <span>Short-lived access tokens, rotated silently on refresh.</span>
          </li>
          <li>
            <span class="mono tag">ROLE</span>
            <span>Fine-grained roles, stamped onto a holder in one action.</span>
          </li>
          <li>
            <span class="mono tag">AUDIT</span>
            <span>Every session traced back to a single clearance badge.</span>
          </li>
        </ul>

        <div class="ticket perforated mono">
          <span>REF·{{ ref }}</span>
          <span>{{ today }}</span>
        </div>
      </section>

      <section class="form-panel">
        <div class="form-card perforated">
          <ng-content />
        </div>
      </section>
    </div>
  `,
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  @Input() headline = 'Identity, on the record.';
  @Input() lede = 'Sign in to manage credentials, roles, and access across the system.';

  readonly today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  readonly ref = Math.random().toString(36).slice(2, 8).toUpperCase();
}
