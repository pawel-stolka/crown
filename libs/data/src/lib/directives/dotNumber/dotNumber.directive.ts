import { Directive, ElementRef, HostListener } from '@angular/core';
import { EMPTY_STRING } from '@crown/data';

@Directive({
  selector: '[dotNumber]',
  standalone: true,
})
export class DotNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue = inputElement.value;

    // Remove any non-numeric and non-dot or comma characters
    inputValue = inputValue.replace(/[^0-9.,]/g, EMPTY_STRING);

    // Replace commas with dots
    inputValue = inputValue.replace(/,/g, '.');

    inputElement.value = inputValue;
  }
}
