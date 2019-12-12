import { OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel } from '@core/api';

export abstract class AbstractCreativeForm implements OnInit {
  static IMAGE_ASSET = 'App-Library-Image';
  static VIDEO_ASSET = 'App-Library-Video';
  static AUDIO_ASSET = 'App-Library-Audio';

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

  @Output() onCreated: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();
  @Output() onUpdated: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  constructor() { }

  ngOnInit() {
    this.performForm();
    if (this.mode === 'create') {
      this.defaultValue();
    }
    console.info(`[${this.mode}] => [${this.parentType}]`);
  }

  public created(docs: DocumentModel[]): void {
    this.onCreated.next(docs);
  }

  public updated(doc: DocumentModel): void {
    this.onUpdated.next(doc);
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
