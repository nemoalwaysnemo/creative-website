import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicDragDropFileZoneModel, DynamicTextAreaModel, DynamicGalleryUploadModel } from '@core/custom';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../document-form-extension';
import { concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'backslash-plugin-trigger-form',
  styleUrls: ['./backslash-plugin-trigger-form.component.scss'],
  template: `<div style="width: 650px">
                <document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>
             </div>`,
})
export class BackslashPluginTriggerFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-plugin-trigger-form';

  protected documentType: string = 'App-Edges-Trigger';

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => {
    delete doc.properties['web-page-element:page-images'];
    return doc;
  }

  private getUserSimplePreference(doc: DocumentModel): Observable<any> {
    return this.documentPageService.getCache('User.SimplePreference', this.documentPageService.getSimplePreference('backslash-chrome-user-country, backslash-chrome-user-agency, backslash-chrome-user-spotter-handle').pipe(
      map((preference: any) => this.updateUserPreference(doc, preference.value)),
    ));
  }

  private updateUserPreference(doc: DocumentModel, preference: any = {}): DocumentModel {
    const properties = Object.assign({}, doc.properties, {
      // 'The_Loupe_Main:agency': preference['backslash-chrome-user-agency'],
      // 'app_Edges:Relevant_Country': this.convertPreferenceListValue(preference['backslash-chrome-user-country']),
      'app_Edges:spotter_handle': this.convertPreferenceListValue(preference['backslash-chrome-user-spotter-handle']),
    });
    return new DocumentModel({ path: doc.path, type: this.getDocType(), properties });
  }

  private convertPreferenceListValue(value: any): any {
    return typeof value === 'string' && value !== 'null' ? value.split(',') : [];
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    if (!doc.type) {
      return observableOf(doc).pipe(concatMap((d: DocumentModel) => this.getUserSimplePreference(d)));
    } else {
      return this.initializeDocument(doc, this.getDocType());
    }
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (event.action === 'UploadFilesChanged' && event.actionType === 'UploadChanged') {
      event.ngFormSettings.switchTabSettings.forEach((t: any) => { t.disabled = true; });
    }
    return observableOf(event);
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
        settings: {
          customClass: 'stress-input',
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicSuggestionModel({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: true,
        document: true,
        settings: {
          placeholder: 'Please select edges',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
          customClass: 'stress-input',
        },
      }),
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
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Category',
        required: true,
        settings: {
          placeholder: 'Please select category',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
          customClass: 'stress-input',
        },
      }),
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
      new DynamicSuggestionModel({
        id: 'app_Edges:Relevant_Country',
        label: 'Relevant Country',
        required: true,
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Geography_TBWA',
          customClass: 'stress-input',
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:insight',
        label: 'Key Insight',
        rows: 5,
        required: true,
        settings: {
          customClass: 'stress-input',
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:trigger_text',
        label: 'Trigger Summary',
        rows: 5,
        required: true,
        settings: {
          customClass: 'stress-input',
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:URL',
        label: 'Main Link',
        rows: 5,
        required: true,
        settings: {
          customClass: 'stress-input',
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:trigger_support_links',
        label: 'Additional Links',
        rows: 5,
        required: false,
      }),
      new DynamicGalleryUploadModel<string>({
        id: 'galleryUpload',
        switchTab: '+ Images',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
        },
        defaultValueFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): any => doc.get('web-page-element:page-images'),
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        switchTab: '+ Upload',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop Image File here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        switchTab: '+ Upload',
        settings: {
          enableInput: false,
          multiUpload: false,
        },
      }),
    ];
  }
}
