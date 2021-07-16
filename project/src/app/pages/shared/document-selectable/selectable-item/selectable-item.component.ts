import { Component, Input, Output, HostBinding, EventEmitter, OnInit } from '@angular/core';
import { SelectableItemService, SelectableItemEvent } from './selectable-item.service';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'selectable-checkbox',
  template: `
    <div [ngClass]="[selectClass]" [ngStyle]="selected ? {'display': 'block'} : {}">
      <nb-checkbox [checked]="selected" [disabled]="disabled" [status]="status" (checkedChange)="onChecked($event)"></nb-checkbox>
    </div>
  `,
})
export class SelectableItemComponent implements OnInit {

  @HostBinding('class.item-selected')
  get isSelected(): boolean {
    return this.selected;
  }

  @Input() status: string = 'info';

  @Input() dataType: string = 'default';

  @Input() disabled: boolean = false;

  @Input() selected: boolean = false;

  @Input() queueLimit: number = 100;

  @Input() document: DocumentModel;

  @Output() onSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectClass: string = '';

  constructor(private selectableItemService: SelectableItemService) {
  }

  ngOnInit(): void {
    this.selectableItemService.setQueueLimit(this.dataType, this.queueLimit);
  }

  onChecked(checked: boolean): void {
    this.selected = checked;
    this.onSelected.emit(checked);
    this.selectableItemService.change(new SelectableItemEvent({ doc: this.document, type: this.dataType, selected: checked, component: this }));
  }

  toggleChecked(): void {
    this.onChecked(!this.selected);
  }

  checkboxSelectStyle(style: string): void {
    this.selectClass = style;
  }
}
