import { Component } from '@angular/core';
import { DocumentModel, NuxeoResponse, UserModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicSuggestionModel, DynamicOptionTagModel, DynamicInputModel } from '@core/custom';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../document-form-extension';
import { concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'backslash-plugin-user-preference-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class BackslashPluginUserPreferenceFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-plugin-user-preference-form';

  private getUserSimplePreference(): Observable<DocumentModel> {
    return this.documentPageService.getSimplePreference('backslash-chrome-user-country, backslash-chrome-user-agency, backslash-chrome-user-city, backslash-chrome-user-spotter, backslash-chrome-user-spotter-handle')
      .pipe(map((preference: NuxeoResponse) => this.getUserPreferenceDocument(preference.value)));
  }

  private setUserSimplePreference(properties: any = {}): Observable<DocumentModel> {
    return this.documentPageService.setSimplePreference(properties).pipe(map((preference: NuxeoResponse) => this.getUserPreferenceDocument(preference.value)));
  }

  private getUserPreferenceDocument(preference: any = {}): DocumentModel {
    const properties = {
      'backslash-chrome-user-city': preference['backslash-chrome-user-city'],
      'backslash-chrome-user-agency': preference['backslash-chrome-user-agency'],
      'backslash-chrome-user-spotter': preference['backslash-chrome-user-spotter'],
      'backslash-chrome-user-country': this.convertPreferenceListValue(preference['backslash-chrome-user-country']),
      'backslash-chrome-user-spotter-handle': this.convertPreferenceListValue(preference['backslash-chrome-user-spotter-handle']),
    };
    return new DocumentModel({ properties });
  }

  private convertPreferenceListValue(value: any): any {
    return typeof value === 'string' && value !== 'null' ? value.split(',') : [];
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.getUserSimplePreference();
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (event.action === 'CustomButtonClicked') {
      return this.setUserSimplePreference(event.formValue).pipe(
        concatMap((ref: DocumentModel) => observableOf(new DocumentFormEvent({ action: 'Updated', messageType: 'success', messageContent: 'Preference has been updated successfully!', doc: ref }))),
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
          customClass: 'stress-input',
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
          customClass: 'stress-input',
        },
      }),
      new DynamicInputModel({
        id: 'backslash-chrome-user-city',
        label: 'City',
        maxLength: 100,
        placeholder: 'City',
        autoComplete: 'off',
        required: false,
        settings: {
          customClass: 'stress-input',
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicOptionTagModel({
        id: 'backslash-chrome-user-spotter-handle',
        label: 'Spotter Handle',
        placeholder: 'Spotter Handle',
        settings: {
          customClass: 'stress-input',
        },
      }),
    ];
  }
}
