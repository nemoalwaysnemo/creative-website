import { Component, Output, EventEmitter, Input } from '@angular/core';

import { Cell } from '../../../lib/data-set/cell';

@Component({
  template: '',
})
export class DefaultEditorComponent implements Editor {
  @Input() cell: Cell;
  @Input() inputClass: string;

  @Output() stopEditing = new EventEmitter<any>();
  @Output() edited = new EventEmitter<any>();
  @Output() click = new EventEmitter<any>();
}

export interface Editor {
  cell: Cell;
  inputClass: string;
  stopEditing: EventEmitter<any>;
  edited: EventEmitter<any>;
  click: EventEmitter<any>;
}
