import { Component, Input, Output, HostBinding, EventEmitter } from '@angular/core';
import { SelectableItemService, SelectableItemEvent } from './selectable-item.service';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'selectable-checkbox',
  template: `
    <div [ngClass]="{'item-selectable-enabled': enableCheckBox}" [ngStyle]="enableCheckBox ? {'display': 'block'} : {'display': 'none'}">
      <nb-checkbox [checked]="selected" [disabled]="disabled" [status]="status" (checkedChange)="onChecked($event)"></nb-checkbox>
    </div>
  `,
  styleUrls: ['./selectable-item.component.scss'],
})
export class SelectableItemComponent {

  @HostBinding('class.item-selected')
  get isSelected(): boolean {
    return this.selected;
  }

  @Input() status: string = 'info';

  @Input() dataType: string = 'default';

  @Input() disabled: boolean = false;

  @Input() selected: boolean = false;

  @Input() enableCheckBox: boolean = true;

  @Input() document: DocumentModel;

  @Output() onSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private selectableItemService: SelectableItemService) {
  }

  onChecked(checked: boolean): void {
    this.selected = checked;
    this.onSelected.emit(checked);
    this.selectableItemService.change(new SelectableItemEvent({ doc: this.document, type: this.dataType, selected: checked, component: this }));
  }

  toggleChecked(): void {
    this.onChecked(!this.selected);
  }
}
