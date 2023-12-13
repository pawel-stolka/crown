import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[lowercase]',
  standalone: true,
})
export class LowercaseDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const lowercase = input.value.toLowerCase();
    this.control.control?.setValue(lowercase, { emitEvent: true });
  }
}
