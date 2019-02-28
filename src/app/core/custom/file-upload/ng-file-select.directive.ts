import { Directive, Input } from '@angular/core';
import { NgFileDirective } from './ng-file.directive';

@Directive({
  selector: '[ngFileSelect]',
})
export class NgFileSelectDirective extends NgFileDirective {
  @Input() selectable: any = true;
}
