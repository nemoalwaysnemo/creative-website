import { Component, Input, Output, SimpleChange, EventEmitter, OnChanges, TemplateRef } from '@angular/core';

import { Grid } from './lib/grid';
import { DataSource } from './lib/data-source/data-source';
import { Row } from './lib/data-set/row';
import { deepExtend } from './lib/helpers';
import { LocalDataSource } from './lib/data-source/local/local.data-source';

@Component({
  selector: 'ng2-smart-table',
  styleUrls: ['./ng2-smart-table.component.scss'],
  templateUrl: './ng2-smart-table.component.html',
})
export class Ng2SmartTableComponent implements OnChanges {

  @Input() source: any;
  @Input() settings: any = {};
  @Input() extendRowRef: TemplateRef<any>;

  @Output() rowSelect = new EventEmitter<any>();
  @Output() userRowSelect = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() create = new EventEmitter<any>();
  @Output() custom = new EventEmitter<any>();
  @Output() deleteConfirm = new EventEmitter<any>();
  @Output() editConfirm = new EventEmitter<any>();
  @Output() createConfirm = new EventEmitter<any>();
  @Output() rowHover: EventEmitter<any> = new EventEmitter<any>();

  tableClass: string;
  tableId: string;
  perPageSelect: any;
  allSelected: boolean;
  isHideHeader: boolean;
  isHideSubHeader: boolean;
  isPagerDisplay: boolean;
  rowClassFunction: () => any;


  grid: Grid;
  defaultSettings: any = {
    mode: 'inline', // inline|external|click-to-edit
    selectMode: 'single', // single|multi
    allSelected: false,
    hideHeader: false,
    hideSubHeader: false,
    showCheckbox: false,
    enableCustomClick: false,
    enableSelectFirstRow: false,
    actions: {
      columnTitle: 'Actions',
      add: true,
      edit: true,
      delete: true,
      custom: [],
      position: 'left', // left|right
    },
    filter: {
      inputClass: '',
    },
    edit: {
      inputClass: '',
      editButtonContent: 'Edit',
      saveButtonContent: 'Update',
      cancelButtonContent: 'Cancel',
      confirmSave: false,
    },
    add: {
      inputClass: '',
      addButtonContent: 'Add New',
      createButtonContent: 'Create',
      cancelButtonContent: 'Cancel',
      confirmCreate: false,
    },
    delete: {
      deleteButtonContent: 'Delete',
      confirmDelete: false,
    },
    attr: {
      id: '',
      class: '',
    },
    noDataMessage: 'No data found',
    extendRow: {},
    columns: {},
    pager: {
      display: true,
      perPage: 24,
    },
    rowClassFunction: () => '',
  };

  isAllSelected: boolean = false;

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    if (this.grid) {
      this.grid.setSelectFirstRow(this.grid.getSetting('enableSelectFirstRow'));
      if (changes['settings']) {
        this.grid.setSettings(this.prepareSettings());
      }
      if (changes['source']) {
        this.source = this.prepareSource();
        this.grid.setSource(this.source);
      }
    } else {
      this.initGrid();
    }
    this.tableId = this.grid.getSetting('attr.id');
    this.tableClass = this.grid.getSetting('attr.class');
    this.isHideHeader = this.grid.getSetting('hideHeader');
    this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
    this.isAllSelected = this.grid.getSetting('allSelected');
    this.isPagerDisplay = this.grid.getSetting('pager.display');
    this.isPagerDisplay = this.grid.getSetting('pager.display');
    this.perPageSelect = this.grid.getSetting('pager.perPageSelect');
    this.rowClassFunction = this.grid.getSetting('rowClassFunction');
  }

  editRowSelect(row: Row): void {
    if (this.grid.getSetting('selectMode') === 'multi') {
      this.onMultipleSelectRow(row);
    } else {
      this.onSelectRow(row);
    }
  }

  onUserSelectRow(row: Row): void {
    if (this.grid.getSetting('selectMode') !== 'multi') {
      this.grid.selectRow(row);
      this.emitUserSelectRow(row);
      this.emitSelectRow(row);
    }
  }

  onRowHover(row: Row): void {
    this.rowHover.emit(row);
  }

  multipleSelectRow(row: Row): void {
    this.grid.multipleSelectRow(row);
    this.emitUserSelectRow(row);
    this.emitSelectRow(row);
  }

  onSelectAllRows($event: any): void {
    this.isAllSelected = !this.isAllSelected;
    this.grid.selectAllRows(this.isAllSelected);

    this.emitUserSelectRow(null);
    this.emitSelectRow(null);
  }

  onSelectRow(row: Row): void {
    this.grid.selectRow(row);
    this.emitSelectRow(row);
  }

  onMultipleSelectRow(row: Row): void {
    this.emitSelectRow(row);
  }

  initGrid(): void {
    this.source = this.prepareSource();
    this.grid = new Grid(this.source, this.prepareSettings());
    this.grid.onSelectRow().subscribe((row) => this.emitSelectRow(row));
  }

  prepareSource(): DataSource {
    if (this.source instanceof DataSource) {
      return this.source;
    } else if (this.source instanceof Array) {
      return new LocalDataSource(this.source);
    }

    return new LocalDataSource();
  }

  prepareSettings(): any {
    return deepExtend({}, this.defaultSettings, this.settings);
  }

  changePage($event: any): void {
    this.resetAllSelector();
  }

  sort($event: any): void {
    this.resetAllSelector();
  }

  filter($event: any): void {
    this.resetAllSelector();
  }

  private resetAllSelector(): void {
    this.isAllSelected = false;
  }

  private emitUserSelectRow(row: Row): void {
    const selectedRows = this.grid.getSelectedRows();

    this.userRowSelect.emit({
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      source: this.source,
      selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
    });
  }

  private emitSelectRow(row: Row): void {
    this.rowSelect.emit({
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      source: this.source,
    });
  }

}
