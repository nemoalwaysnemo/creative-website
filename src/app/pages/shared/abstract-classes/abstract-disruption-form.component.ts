import { OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentFormEvent } from '../document-form/document-form.interface';

export abstract class AbstractDisruptionForm implements OnInit {

  static THINKING = 'App-Disruption-Asset';

  static DAY = 'App-Disruption-Day';

  static DAY_ASSET = 'App-Disruption-Day-Asset';

  static ROADMAP = 'App-Disruption-Roadmap-Asset';

  static THEORY = 'App-Disruption-Theory-Asset';

  parentDocument: DocumentModel;

  formLayout: any = {};

  settings: any[] = [];

  dynamicModelIndex: number[] = [0];

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

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  constructor() { }

  ngOnInit(): void {
    this.performForm();
    if (this.mode === 'create') {
      this.defaultValue();
    }
    console.info(`[${this.mode}] => [${this.parentType}]`);
  }

  protected performForm(): void {
    this.settings = this.getSettings();
    this.formLayout = this.getFormLayout();
  }

  private defaultValue() {
    const settings = this.getSettings();
    settings.filter(setting => !!setting.default && setting.formMode !== 'edit').forEach(setting => {
      this.parentDocument.properties[setting.id] = setting.default;
    });
  }

  protected abstract getSettings(): any[];
  protected abstract getFormLayout(): any;
}
