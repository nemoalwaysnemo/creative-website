import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { deepExtend } from '@core/services/helpers';
import { of as observableOf, Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDragDropFileZoneModel, DynamicTextAreaModel, DynamicGalleryUploadModel, DynamicFormControlModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../document-form-extension';
import { DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from '../document-form/document-form.interface';

@Component({
  selector: 'backslash-trigger-plugin-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class BackslashTriggerPluginFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-trigger-plugin-form';

  protected documentType: string = 'App-Edges-Trigger';

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => {
    delete doc.properties['web-page-element:page-images'];
    return doc;
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    if (doc.type === 'Web-Page-Element') {
      const properties = Object.assign({}, this.document.properties, {
        'web-page-element:page-images': doc.get('web-page-element:page-images'),
        'app_Edges:URL': doc.get('web-page-element:page-url'),
        'dc:title': doc.title,
      });
      return observableOf(new DocumentModel({
        path: this.document.path,
        type: this.getDocType(),
        properties,
      }));
    } else {
      return this.initializeDocument(doc, this.getDocType());
    }
  }

  protected beforeOnCallback(event: DocumentFormEvent): DocumentFormEvent {
    if (event.action === 'UploadFilesChanged' && event.uploadType === 'GALLERY_UPLOAD') {
      event.ngFormSettings.switchTabSettings.forEach((t: any) => { t.disabled = true; });
    }
    return event;
  }

  protected getFormSwitchTab(): any[] {
    return [
      {
        name: '+ Images',
        active: true,
        disabledFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => false,
      },
      {
        name: '+ Upload',
        disabledFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => false,
      },
    ];
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Headline',
        maxLength: 220,
        placeholder: 'Headline',
        autoComplete: 'off',
        required: true,
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      // new DynamicSuggestionModel({
      //   id: 'app_Edges:Tags_edges',
      //   label: 'Edges',
      //   required: true,
      //   document: true,
      //   settings: {
      //     placeholder: 'Please select edges',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'App-Edges-Edges',
      //   },
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:agency',
      //   label: 'Agency',
      //   required: true,
      //   settings: {
      //     multiple: false,
      //     placeholder: 'Please select agency',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'GLOBAL_Agencies',
      //   },
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'app_Edges:backslash_category',
      //   label: 'Category',
      //   required: true,
      //   settings: {
      //     placeholder: 'Please select category',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'App-Backslash-Categories',
      //   },
      // }),
      // new DynamicTextAreaModel({
      //   id: 'app_Edges:insight',
      //   label: 'Key Insight',
      //   rows: 5,
      //   required: true,
      // }),
      // new DynamicSuggestionModel({
      //   id: 'app_Edges:format',
      //   label: 'Format',
      //   required: true,
      //   settings: {
      //     placeholder: 'Please select format',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'App-Backslash-Type',
      //   },
      // }),
      // new DynamicSuggestionModel({
      //   id: 'app_Edges:Relevant_Country',
      //   label: 'Relevant Country',
      //   required: true,
      //   settings: {
      //     placeholder: 'Please select country',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'GLOBAL_Geography_TBWA',
      //   },
      // }),
      // new DynamicTextAreaModel({
      //   id: 'app_Edges:trigger_text',
      //   label: 'Trigger Summary',
      //   rows: 5,
      //   required: true,
      // }),
      // new DynamicOptionTagModel({
      //   id: 'The_Loupe_Main:brand',
      //   label: 'Brand(s)',
      //   placeholder: 'Brand',
      //   required: false,
      // }),
      new DynamicTextAreaModel({
        id: 'app_Edges:URL',
        label: 'Web Link',
        rows: 5,
        required: true,
      }),
      new DynamicGalleryUploadModel<string>({
        id: 'galleryUpload',
        switchTab: '+ Images',
        formMode: 'create',
        settings: {
          queueLimit: 1,
          uploadType: 'asset',
        },
        defaultValueFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): any => doc.get('web-page-element:page-images'),
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        uploadType: 'asset',
        queueLimit: 1,
        placeholder: 'Drop Image File here!',
        acceptTypes: 'image/*',
        switchTab: '+ Upload',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        switchTab: '+ Upload',
        settings: {
          showInput: false,
          multiUpload: false,
        },
      }),
    ];
  }
}
