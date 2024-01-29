import { NgControl } from '@angular/forms';
import { LowercaseDirective } from './lowercase.directive';

describe('LowercaseDirective', () => {
  let control: NgControl;

  it('should create an instance', () => {
    const directive = new LowercaseDirective(control);
    expect(directive).toBeTruthy();
  });
});
