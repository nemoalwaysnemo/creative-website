import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { dataUrl } from './file-tools';

@Directive({
  selector: '[ngfBackground]',
})
export class NgFileBackgroundDirective implements OnChanges {

  @Input('ngFileBackground') file: any;

  constructor(public elementRef: ElementRef) { }

  ngOnChanges(changes: any): void {
    dataUrl(this.file).then((src: any) => {
      const urlString = 'url(\'' + (src || '') + '\')';
      this.elementRef.nativeElement.style.backgroundImage = urlString;
    });
  }
}
