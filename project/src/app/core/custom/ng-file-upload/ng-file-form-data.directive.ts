import { IterableDiffer, IterableDiffers, Directive, EventEmitter, Output, Input, DoCheck } from '@angular/core';

@Directive({
  selector: '[ngFileFormData]',
})
export class NgFileFormDataDirective implements DoCheck {

  @Input() files: File[];

  @Input() postName: string = 'file';

  @Input() fileName: string; // force file name

  @Input() FormData: FormData = new FormData();

  @Output() FormDataChange: EventEmitter<FormData> = new EventEmitter();

  private differ: IterableDiffer<any>;

  constructor(iterableDiffers: IterableDiffers) {
    this.differ = iterableDiffers.find([]).create();
  }

  ngDoCheck(): void {
    const changes = this.differ.diff(this.files);
    if (changes) {
      setTimeout(() => this.buildFormData(), 0);
    }
  }

  buildFormData(): void {
    const isArray = typeof (this.files) === 'object' && this.files.constructor === Array;

    if (isArray) {
      this.FormData = new FormData();
      const files = this.files || [];
      files.forEach(file => this.FormData.append(this.postName, file, this.fileName || file.name));
      this.FormDataChange.emit(this.FormData);
    } else {
      delete this.FormData;
    }
  }
}
