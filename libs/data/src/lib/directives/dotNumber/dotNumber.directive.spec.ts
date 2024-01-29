import { ElementRef } from '@angular/core';
import { DotNumberDirective } from './dotNumber.directive';

describe('DotNumberDirective', () => {
  let ref: ElementRef = {} as ElementRef;

  it('should create an instance', () => {
    const directive = new DotNumberDirective(ref);
    expect(directive).toBeTruthy();
  });
});
