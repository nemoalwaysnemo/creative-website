import { Column } from './column';

export class Cell {

  newValue: any = '';
  protected static PREPARE = (value: any) => value;

  constructor(protected value: any, protected row: any, protected column: any, protected dataSet: any) {
    this.newValue = value;
  }

  getColumn(): Column {
    return this.column;
  }

  getRow(): any {
    return this.row;
  }

  getValue(): any {
    const valid = this.column.getValuePrepareFunction() instanceof Function;
    const prepare = valid ? this.column.getValuePrepareFunction() : Cell.PREPARE;
    return prepare.call(null, this.value, this.row.getData(), this);
  }

  setValue(value: any): any {
    this.newValue = value;
  }

  getId(): string {
    return this.getColumn().id;
  }

  getTitle(): string {
    return this.getColumn().title;
  }

  isEditable(): boolean {
    if (this.getRow().index === -1) {
      return this.getColumn().isAddable;
    } else {
      return this.getColumn().isEditable;
    }
  }

}
