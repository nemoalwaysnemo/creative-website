import { Component } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { AbstractDocumentFormComponent } from '@pages/shared/abstract-classes/abstract-document-form.component';
import { NuxeoApiService, DocumentModel } from '@core/api';

@Component({
  selector: 'disruption-roadmap-form',
  template: `<document-form [document]="document" [settings]="settings" [layout]="formLayout" (callback)="callback($event)"></document-form>`,
})
export class DisruptionDayAssetFormComponent extends AbstractDocumentFormComponent {
  protected documentType: string = 'App-Disruption-Day-Asset';
  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  protected getSettings(): object[] {
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
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Published',
        formMode: 'edit',
        placeholder: 'Published',
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
        id: 'app_Edges:backslash_category',
        label: 'Backslash Category',
        directoryName: 'App-Backslash-Categories',
        formMode: 'edit',
        placeholder: 'Please select category',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Leave blank to copy from Disruption Day',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:description',
        label: 'Description',
        formMode: 'edit',
        placeholder: 'description',
      }),
      new DynamicInputModel({
        id: 'dc:creator',
        label: 'Author',
        placeholder: 'Author',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 25,
        placeholder: 'Drop PDF/Video File(s) here!',
        acceptTypes: '.pdf,.mov,.mp4,.mp1',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop PDF/Video File(s) here!',
        acceptTypes: '.pdf,.mov,.mp4,.mp1',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'edit',
        uploadType: 'attachment',
        layoutPosition: 'right',
        queueLimit: 20,
        placeholder: 'Drop to upload attachment',
        acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'create',
        multiUpload: true,
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'edit',
        showInputs: false,
        multiUpload: true,
      }),
    ];
  }

  protected getFormLayout(): any {
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
      'The_Loupe_Main:description': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:backslash_category': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_ProdCredits:production_date': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:Relevant_Country': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:agency': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:country': {
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
