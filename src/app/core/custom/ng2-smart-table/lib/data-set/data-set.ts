import { Row } from './row';
import { Column } from './column';

export class DataSet {

  newRow: Row;

  protected data: any[] = [];
  protected columns: Column[] = [];
  protected rows: Row[] = [];
  protected selectedRow: Row;
  protected willSelect: string = 'first';

  constructor(data: any[] = [], protected columnSettings: Object) {
    this.createColumns(columnSettings);
    this.setData(data);
    this.createNewRow();
  }

  setData(data: any[]): void {
    this.data = data;
    this.createRows();
  }

  getColumns(): Column[] {
    return this.columns;
  }

  getRows(): Row[] {
    return this.rows;
  }

  getFirstRow(): Row {
    return this.rows[0];
  }

  getLastRow(): Row {
    return this.rows[this.rows.length - 1];
  }

  findRowByData(data: any): Row {
    return this.rows.find((row: Row) => row.getData() === data);
  }

  deselectAll(): void {
    this.rows.forEach((row) => {
      row.isSelected = false;
    });
  }

  selectRow(row: Row): Row {
    const previousIsSelected = row.isSelected;
    this.deselectAll();

    row.isSelected = !previousIsSelected;
    this.selectedRow = row;

    return this.selectedRow;
  }

  multipleSelectRow(row: Row): Row {
    row.isSelected = !row.isSelected;
    this.selectedRow = row;

    return this.selectedRow;
  }

  selectPreviousRow(): Row {
    if (this.rows.length > 0) {
      let index = this.selectedRow ? this.selectedRow.index : 0;
      if (index > this.rows.length - 1) {
        index = this.rows.length - 1;
      }
      this.selectRow(this.rows[index]);
      return this.selectedRow;
    }
  }

  selectFirstRow(): Row {
    if (this.rows.length > 0) {
      this.selectRow(this.rows[0]);
      return this.selectedRow;
    }
  }

  selectLastRow(): Row {
    if (this.rows.length > 0) {
      this.selectRow(this.rows[this.rows.length - 1]);
      return this.selectedRow;
    }
  }

  willSelectFirstRow(): void {
    this.willSelect = 'first';
  }

  willSelectLastRow(): void {
    this.willSelect = 'last';
  }

  select(): Row {
    if (this.getRows().length === 0) {
      return;
    }
    if (this.willSelect) {
      if (this.willSelect === 'first') {
        this.selectFirstRow();
      }
      if (this.willSelect === 'last') {
        this.selectLastRow();
      }
      this.willSelect = '';
    } else {
      this.selectFirstRow();
    }

    return this.selectedRow;
  }

  createNewRow(): void {
    this.newRow = new Row(-1, {}, this);
    this.newRow.isInEditing = true;
  }

  /**
   * Create columns by mapping from the settings
   * @param settings
   * @private
   */
  createColumns(settings: any): void {
    for (const id in settings) {
      if (settings.hasOwnProperty(id)) {
        this.columns.push(new Column(id, settings[id], this));
      }
    }
  }

  /**
   * Create rows based on current data prepared in data source
   * @private
   */
  createRows(): void {
    this.rows = [];
    this.data.forEach((el, index) => {
      this.rows.push(new Row(index, el, this));
    });
  }
}
