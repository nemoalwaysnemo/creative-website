import { Directive, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ngFileUploadStatus]',
})
export class NgFileUploadStatusDirective implements OnChanges {

  @Input() percent: number;

  @Input() httpEvent: Event;

  @Output() percentChange: EventEmitter<number> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.httpEvent && changes.httpEvent.currentValue) {
      const event = changes.httpEvent.currentValue;
      if (event.loaded && event.total) {
        setTimeout(() => {
          this.percent = Math.round(100 * event.loaded / event.total);
          this.percentChange.emit(this.percent);
        }, 0);
      }
    }
  }
}
