import { Component, Input, Output, EventEmitter, OnChanges, TemplateRef, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '../../lib/data-source/data-source';
import { Row } from '../../lib/data-set/row';
import { Grid } from '../../lib/grid';
import { timer } from 'rxjs';

@Component({
  selector: '[ng2-st-tbody]',
  styleUrls: ['./tbody.component.scss'],
  templateUrl: './tbody.component.html',
})
export class Ng2SmartTableTbodyComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() source: DataSource;
  @Input() deleteConfirm: EventEmitter<any>;
  @Input() editConfirm: EventEmitter<any>;
  @Input() extendRowRef: TemplateRef<any>;
  @Input() rowClassFunction: () => void;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() custom = new EventEmitter<any>();
  @Output() edited = new EventEmitter<any>();
  @Output() userSelectRow = new EventEmitter<any>();
  @Output() editRowSelect = new EventEmitter<any>();
  @Output() multipleSelectRow = new EventEmitter<any>();
  @Output() rowHover = new EventEmitter<any>();

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  mode: string;
  editInputClass: string;
  isActionAdd: boolean;
  isActionEdit: boolean;
  isActionDelete: boolean;
  noDataMessage: boolean;
  isShowCheckbox: boolean;

  rows: Row[] = [];
  extendRowState: any = {};

  constructor(private ref: ChangeDetectorRef) {

  }

  get tableColumnsCount(): number {
    const actionColumns = this.isActionAdd || this.isActionEdit || this.isActionDelete ? 1 : 0;
    const selectColumns = this.grid.isMultiSelectVisible() ? 1 : 0;
    return this.grid.getColumns().length + selectColumns + actionColumns;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.mode = this.grid.getSetting('mode');
    this.editInputClass = this.grid.getSetting('edit.inputClass');
    this.showActionColumnRight = this.grid.showActionColumn('right');
    this.isActionAdd = this.grid.getSetting('actions.add');
    this.isActionEdit = this.grid.getSetting('actions.edit');
    this.isActionDelete = this.grid.getSetting('actions.delete');
    this.noDataMessage = this.grid.getSetting('noDataMessage');
    this.isShowCheckbox = this.grid.getSetting('showCheckbox');
    timer(0).subscribe(() => { this.rows = this.grid.getRows(); this.ref.detectChanges(); });
  }

  onUserSelectRow(row: Row): void {
    if (this.extendRowRef) {
      this.extendRowState[row.index] = !this.extendRowState[row.index];
    }
    this.userSelectRow.emit(row);
  }
}
