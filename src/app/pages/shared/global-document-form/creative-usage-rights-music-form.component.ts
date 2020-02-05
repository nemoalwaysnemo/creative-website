import { Component } from '@angular/core';
import { NuxeoApiService, DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { AbstractDocumentFormComponent } from '@pages/shared/abstract-classes/abstract-document-form.component';
import { Observable } from 'rxjs';
import { OptionModel } from '../option-select/option-select.interface';
@Component({
  selector: 'creative-usage-rights-music-form',
  template: `<document-form [document]="document" [settings]="settings" [layout]="formLayout" (onCreated)="created($event)" (onUpdated)="updated($event)"></document-form>`,
})
export class CreativeUsageRightsMusicComponent extends AbstractDocumentFormComponent {

  protected documentType: string = 'App-Library-UsageRights-Music';

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  protected beforeSetDocument(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Music Company',
        autoComplete: 'off',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_type',
        label: 'Contract Type',
        placeholder: 'Select a value',
        directoryName: 'App-Library-UR-Music-contract-types',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        document: true,
        contentViewProvider: 'App-Library-PageProvider-Campaigns',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Campaign/Project',
        autoComplete: 'off',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => !doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Number',
        placeholder: 'Workshop Date',
        required: false,
      }),

      new DynamicInputModel({
        id: 'The_Loupe_Main:comment',
        label: 'Comment',
        required: false,
      }),

      new DynamicInputModel({
        id: 'The_Loupe_Rights:contact_client',
        label: 'Contact Client',
        required: false,
      }),

      // new DynamicInputModel({
      //   id: 'The_Loupe_Main:brand',
      //   label: 'Brand',
      //   required: false,
      // }),

      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
        document: true,
        operationName: 'javascript.provideBrands',
        visibleFn: (doc: DocumentModel): boolean => !doc.getParent().getParent().get('app_global:brand_activation'),
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),

      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        required: false,
        directoryName: 'App-Library-UR-Music-contract-types',
      }),

      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        required: false,
        multiple: true,
        directoryName: 'GLOBAL_Countries',
      }),

      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'image/*,.pdf',
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
        multiUpload: false,
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
