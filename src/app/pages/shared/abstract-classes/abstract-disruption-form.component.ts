import { OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel } from '@core/api';

export abstract class AbstractDisruptionForm implements OnInit {
  static THINKING = 'App-Disruption-Asset';
  static DAY = 'App-Disruption-Day';
  static DAY_ASSET = 'App-Disruption-Day-Asset';
  static ROADMAP = 'App-Disruption-Roadmap-Asset';
  static THEORY = 'App-Disruption-Theory-Asset';


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