import { Component } from '@angular/core';

import { DefaultEditorComponent } from './default-editor';

@Component({
  selector: 'textarea-editor',
  styleUrls: ['./editor.component.scss'],
  template: `
    <textarea [ngClass]="inputClass"
              class="form-control"
              [(ngModel)]="cell.newValue"
              [name]="cell.getId()"
              [disabled]="!cell.isEditable()"
              [placeholder]="cell.getTitle()"
              (click)="click.emit($event)"
              (keydown.enter)="edited.emit($event)"
              (keydown.esc)="stopEditing.emit()">
    </textarea>
    `,
})
export class TextareaEditorComponent extends DefaultEditorComponent {

  constructor() {
    super();
  }
}
