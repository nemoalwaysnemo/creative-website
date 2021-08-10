import { Component } from '@angular/core';

import { DefaultEditorComponent } from './default-editor';

@Component({
  selector: 'input-editor',
  styleUrls: ['./editor.component.scss'],
  template: `
    <input [ngClass]="inputClass"
           class="form-control"
           [(ngModel)]="cell.newValue"
           [name]="cell.getId()"
           [placeholder]="cell.getTitle()"
           [disabled]="!cell.isEditable()"
           (click)="click.emit($event)"
           (keydown.enter)="edited.emit($event)"
           (keydown.esc)="stopEditing.emit()">
    `,
})
export class InputEditorComponent extends DefaultEditorComponent {

  constructor() {
    super();
  }
}
