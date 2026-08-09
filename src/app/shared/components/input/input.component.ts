import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sr-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="sr-field" [class.has-error]="!!error" [class.focused]="focused">
      <input
        [type]="type"
        [attr.autocomplete]="autocomplete"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="focused = true"
        placeholder=" "
      />
      <span class="floating-label">{{ label }}</span>
      <span class="hint mono" *ngIf="hint && !error">{{ hint }}</span>
      <span class="error-text" *ngIf="error">{{ error }}</span>
    </label>
  `,
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'tel' = 'text';
  @Input() autocomplete = 'off';
  @Input() hint = '';
  @Input() error = '';

  value = '';
  focused = false;
  private disabled = false;

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
  }
}
