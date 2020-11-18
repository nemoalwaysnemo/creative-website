import { Component } from '@angular/core';
import { DocumentModel, NuxeoResponse } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicSuggestionModel, DynamicOptionTagModel } from '@core/custom';
import { DocumentFormEvent } from '../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../document-form-extension';
import { concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'backslash-plugin-user-preference-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class BackslashPluginUserPreferenceFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-plugin-user-preference-form';

  private getUserSamplePreference(): Observable<DocumentModel> {
    return this.documentPageService.getSimplePreference('backslash-chrome-user-country, backslash-chrome-user-agency, backslash-chrome-user-spotter-handle')
      .pipe(map((preference: NuxeoResponse) => this.getUserPreferenceDocument(preference.value)));
  }

  private setUserSamplePreference(properties: any = {}): Observable<DocumentModel> {
    return this.documentPageService.setSimplePreference(properties).pipe(map((preference: NuxeoResponse) => this.getUserPreferenceDocument(preference.value)));
  }

  private getUserPreferenceDocument(preference: any = {}): DocumentModel {
    const properties = {
      'backslash-chrome-user-agency': preference['backslash-chrome-user-agency'],
      'backslash-chrome-user-country': this.convertPreferenceListValue(preference['backslash-chrome-user-country']),
      'backslash-chrome-user-spotter-handle': this.convertPreferenceListValue(preference['backslash-chrome-user-spotter-handle']),
    };
    return new DocumentModel({ properties });
  }

  private convertPreferenceListValue(value: any): any {
    return typeof value === 'string' ? value.split(',') : [];
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return this.getUserSamplePreference();
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (event.action === 'CustomButtonClicked') {
      return this.setUserSamplePreference(event.formValue).pipe(
        concatMap((ref: DocumentModel) => observableOf(new DocumentFormEvent({ action: 'Updated', messageType: 'success', messageContent: 'Document has been updated successfully!', doc: ref }))),
      );
    }
    return observableOf(event);
  }

  protected getFormSettings(): any {
    return {
      showUploadMessage: true,
    };
  }

  protected getFormModels(): any[] {
    return [
      new DynamicSuggestionModel<string>({
        id: 'backslash-chrome-user-agency',
        label: 'Agency',
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Please select agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicSuggestionModel({
        id: 'backslash-chrome-user-country',
        label: 'Country',
        required: true,
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Geography_TBWA',
        },
      }),
      new DynamicOptionTagModel({
        id: 'backslash-chrome-user-spotter-handle',
        label: 'Spotter Handle',
        placeholder: 'Spotter Handle',
      }),
    ];
  }
}