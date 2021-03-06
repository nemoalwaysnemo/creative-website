import { Component } from '@angular/core';

import { DefaultEditorComponent } from './default-editor';

@Component({
  selector: 'checkbox-editor',
  styleUrls: ['./editor.component.scss'],
  template: `
    <input [ngClass]="inputClass"
           type="checkbox"
           class="form-control"
           [name]="cell.getId()"
           [disabled]="!cell.isEditable()"
           [checked]="cell.getValue() === (cell.getColumn().getConfig()?.true || true)"
           (click)="click.emit($event)"
           (change)="onChange($event)">
    `,
})
export class CheckboxEditorComponent extends DefaultEditorComponent {

  constructor() {
    super();
  }

  onChange(event: any): void {
    const trueVal = (this.cell.getColumn().getConfig() && this.cell.getColumn().getConfig().true) || true;
    const falseVal = (this.cell.getColumn().getConfig() && this.cell.getColumn().getConfig().false) || false;
    this.cell.newValue = event.target.checked ? trueVal : falseVal;
  }
}
