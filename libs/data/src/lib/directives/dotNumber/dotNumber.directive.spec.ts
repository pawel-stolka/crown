import { ElementRef } from '@angular/core';
import { DotNumberDirective } from './dotNumber.directive';

describe('DotNumberDirective', () => {
  it('should create an instance', () => {
    let el: ElementRef = {} as ElementRef;
    const directive = new DotNumberDirective(el);
    expect(directive).toBeTruthy();
  });
});
