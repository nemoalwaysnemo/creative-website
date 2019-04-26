import { OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel } from '@core/api';

export abstract class DisruptionBaseForm implements OnInit {

  parentDocument: DocumentModel;

  formLayout: any = {};

  settings: any[] = [];

   protected abstract parentType: string;

  @Input() mode: 'create' | 'edit' = 'create';

  @Input()
  set document(doc: DocumentModel) {
    if (this.mode === 'create') {
      this.parentDocument = doc.newInstance(this.parentType);
    } else if (this.mode === 'edit') {
      this.parentDocument = doc;
    }
  }

  @Output() onCreated: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();

  constructor() { }

  ngOnInit() {
    this.performForm();
  }

  public ceated(docs: DocumentModel[]): void {
    this.onCreated.next(docs);
  }

  public onUpdated(doc: DocumentModel): void {

  }

  protected performForm(): void {
    this.settings = this.getSettings();
    this.formLayout = this.getFormLayout();
  }

  protected abstract getSettings();
  protected abstract getFormLayout();
}
