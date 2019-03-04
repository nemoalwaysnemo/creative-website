import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgFileDirective } from './ng-file.directive';

export interface DragMeta {
  type: string;
  kind: string;
}

@Directive({
  selector: '[ngFileDrop]',
})
export class NgFileDropDirective extends NgFileDirective {
  @Output() fileOver: EventEmitter<any> = new EventEmitter();

  @Input() validDrag: boolean = false;
  @Output() validDragChange: EventEmitter<boolean> = new EventEmitter();

  @Input() invalidDrag = false;
  @Output() invalidDragChange: EventEmitter<boolean> = new EventEmitter();

  @Input() dragFiles: DragMeta[];
  @Output() dragFilesChange: EventEmitter<DragMeta[]> = new EventEmitter();

  @HostListener('drop', ['$event'])
  onDrop(event: Event): void {
    this.closeDrags();
    const files = this.eventToFiles(event);
    if (!files.length) return;
    this.stopEvent(event);
    this.handleFiles(files);
  }

  handleFiles(files: File[]) {
    this.fileOver.emit(false); // turn-off dragover
    super.handleFiles(files);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: Event): void {
    const transfer = this.eventToTransfer(event);
    const files = this.eventToFiles(event);
    const jsonFiles = this.filesToWriteableObject(files);
    this.dragFilesChange.emit(this.dragFiles = jsonFiles);
    if (files.length) {
      this.validDrag = this.isFilesValid(files);
    } else {
      // Safari, IE11 & some browsers do NOT tell you about dragged files until dropped. Always consider a valid drag
      this.validDrag = true;
    }
    this.validDragChange.emit(this.validDrag);
    this.invalidDrag = !this.validDrag;
    this.invalidDragChange.emit(this.invalidDrag);
    transfer.dropEffect = 'copy'; // change cursor and such
    this.stopEvent(event);
    this.fileOver.emit(true);
  }

  /** browsers try hard to conceal data about file drags, this tends to undo that */
  filesToWriteableObject(files: File[]): DragMeta[] {
    const jsonFiles: DragMeta[] = [];
    for (let x = 0; x < files.length; ++x) {
      jsonFiles.push({
        type: files[x].type,
        kind: files[x]['kind'],
      });
    }
    return jsonFiles;
  }

  closeDrags() {
    delete this.validDrag;
    this.validDragChange.emit(this.validDrag);
    this.invalidDrag = false;
    this.invalidDragChange.emit(this.invalidDrag);
    delete this.dragFiles;
    this.dragFilesChange.emit(this.dragFiles);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: Event): any {
    this.closeDrags();
    if ((this as any).element) {
      if (event.currentTarget === (this as any).element[0]) {
        return;
      }
    }
    this.stopEvent(event);
    this.fileOver.emit(false);
  }
}
