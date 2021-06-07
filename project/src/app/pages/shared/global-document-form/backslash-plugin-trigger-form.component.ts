import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicDragDropFileZoneModel, DynamicTextAreaModel, DynamicGalleryUploadModel, DynamicOptionTagModel, DynamicListModel } from '@core/custom';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../document-form-extension';
import { concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'backslash-plugin-trigger-form',
  template: `<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"><ng-content select=".custom-button"></ng-content></document-form>`,
})
export class BackslashPluginTriggerFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-plugin-trigger-form';

  protected documentType: string = 'App-Edges-Trigger';

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => {
    doc.properties['app_Edges:trigger_additional_links'] = (doc.properties['app_Edges:trigger_additional_links'] || []).filter((x: any) => x);
    delete doc.properties['web-page-element:page-images'];
    return observableOf(doc);
  }

  private getUserSimplePreference(doc: DocumentModel, user: UserModel): Observable<any> {
    return this.documentPageService.getSimplePreference('backslash-chrome-user-country, backslash-chrome-user-agency, backslash-chrome-user-city, backslash-chrome-user-spotter, backslash-chrome-user-spotter-handle').pipe(
      map((preference: any) => this.updateUserPreference(doc, user, preference.value)),
    );
  }

  private updateUserPreference(doc: DocumentModel, user: UserModel, preference: any = {}): DocumentModel {
    const properties = Object.assign({}, doc.properties, {
      'app_Edges:Spotter': user.username,
      'The_Loupe_Main:city': preference['backslash-chrome-user-city'],
      'The_Loupe_Main:agency': preference['backslash-chrome-user-agency'],
      'The_Loupe_Main:country': this.convertPreferenceListValue(preference['backslash-chrome-user-country']),
      'app_Edges:spotter_handle': this.convertPreferenceListValue(preference['backslash-chrome-user-spotter-handle']),
    });
    return new DocumentModel({ uid: doc.uid, path: doc.path, title: doc.title, type: this.getDocType(), properties });
  }

  private convertPreferenceListValue(value: any): any {
    return typeof value === 'string' && value !== 'null' ? value.split(',') : [];
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    if (doc.type === 'App-Edges-Folder') {
      return this.initializeDocument(doc, this.getDocType()).pipe(concatMap((d: DocumentModel) => this.getUserSimplePreference(d, user)));
    } else {
      return observableOf(doc).pipe(concatMap((d: DocumentModel) => this.getUserSimplePreference(d, user)));
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
      new DynamicOptionTagModel({
        id: 'app_Edges:spotter_handle',
        label: 'Spotter Handle',
        placeholder: 'Spotter Handle',
        required: true,
        settings: {
          customClass: 'stress-input',
        },
      }),
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
      new DynamicInputModel({
        id: 'app_Edges:URL',
        label: 'Main Link',
        required: true,
        layoutPosition: 'right',
        settings: {
          customClass: 'stress-input',
        },
      }),
      new DynamicListModel({
        id: 'app_Edges:trigger_additional_links',
        label: 'Additional Links',
        required: false,
        layoutPosition: 'right',
        settings: {
          customClass: 'stress-input',
          subPathKey: 'item',
          items: [
            new DynamicInputModel({
              id: 'item',
              label: 'Additional Link',
              // maxLength: 50,
              placeholder: 'Please enter a link',
              autoComplete: 'off',
              required: true,
              validators: {
                required: null,
                minLength: 4,
              },
              errorMessages: {
                required: '{{label}} is required',
                minLength: 'At least 4 characters',
              },
            }),
          ],
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:insight',
        label: 'Key Insight',
        rows: 2,
        required: true,
        layoutPosition: 'right',
        settings: {
          customClass: 'stress-input',
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:trigger_text',
        label: 'Trigger Summary',
        rows: 2,
        required: true,
        layoutPosition: 'right',
        settings: {
          customClass: 'stress-input',
        },
      }),
      new DynamicGalleryUploadModel<string>({
        id: 'galleryUpload',
        switchTab: '+ Images',
        required: true,
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
        },
        defaultValueFn: (ctx: DocumentFormContext): any => ctx.currentDocument.get('web-page-element:page-images'),
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
          enableForm: false,
          enableAction: false,
        },
      }),
    ];
  }
}
