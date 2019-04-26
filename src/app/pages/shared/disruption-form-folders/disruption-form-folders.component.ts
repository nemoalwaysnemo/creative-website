import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel } from '@core/custom';

@Component({
  selector: 'disruption-form-folders',
  templateUrl: './disruption-form-folders.component.html',
})
export class DisruptionFormFoldersComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  parentDocument: DocumentModel;

  formLayout: any = {};

  settings: any[] = [];

  @Input()
  set document(doc: DocumentModel) {
    this.parentDocument = doc.newInstance('App-Disruption-Day-Asset');
  }

  @Output() onCreated: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();


  constructor() { }

  ngOnInit() {
    this.performForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ceated(docs: DocumentModel[]): void {
    this.onCreated.next(docs);
  }

  onUpdated(doc: DocumentModel): void {

  }

  private performForm(): void {
    this.settings = this.getSettings();
    this.formLayout = this.getFormLayout();
  }

  private getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
        placeholder: 'Title',
        autoComplete: 'off',
        required: false,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Leave blank to copy from Disruption Day',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        directoryName: 'GLOBAL_Industries',
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        directoryName: 'GLOBAL_Agencies',
        multiple: false,
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Agency Country',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'uploadFiles',
        label: 'Attachment',
        formMode: 'create',
        multiUpload: false,
        queueLimit: 1,
        placeholder: 'Drop file here!',
      }),
    ];
  }

  private getFormLayout(): any {
    return {
      'dc:title': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:brand': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:industry': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
    };
  }

}
