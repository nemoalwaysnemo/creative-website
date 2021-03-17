import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable } from 'rxjs';
import {
  DynamicListModel,
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicOptionTagModel,
  DynamicSuggestionModel,
  DynamicBatchUploadModel,
  DynamicDatepickerDirectiveModel,
  DynamicDragDropFileZoneModel,
  DynamicFieldHeaderModel,
} from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';

@Component({
  selector: 'learning-program-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class LearningProgramFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'learning-program-form';

  protected documentType: string = 'App-Learning-Program';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => {
    const list = (doc.properties['app_Learning:program_dates'] || []).map((date: any) => date['app_Learning:program_dates_item']);
    if (list.length > 0) {
      doc.properties['app_Learning:program_dates'] = list;
    }
    return doc;
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getFormModels(): any[] {
    return [
      new DynamicFieldHeaderModel<string>({
        id: 'visible-to-everyone-header',
        placeholder: 'VISIBLE TO EVERYONE',
      }),
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Program Title',
        maxLength: 150,
        placeholder: 'Program Title',
        autoComplete: 'off',
        required: false,
        hidden: true,
        formMode: 'create',
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Program Title',
        maxLength: 150,
        placeholder: 'Program Title',
        autoComplete: 'off',
        required: true,
        formMode: 'edit',
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Learning:program_category',
        label: 'Program Category',
        settings: {
          multiple: false,
          placeholder: '',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Learning-Program-Categories',
        },
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'app_Learning:program_purpose',
        label: 'Program Purpose',
        maxLength: 50,
        required: false,
      }),
      new DynamicTextAreaModel({
        id: 'dc:description',
        label: 'Overview',
        rows: 5,
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'app_Learning:program_curriculum',
        label: 'Core Curriculum',
        required: false,
        placeholder: 'Core Curriculum',
      }),
      new DynamicTextAreaModel({
        id: 'app_Learning:program_candidate_description',
        label: 'The Ideal Candidate',
        rows: 5,
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'app_Learning:program_candidate_properties',
        label: 'Candidate Properties',
        required: false,
        placeholder: 'Candidate Properties',
      }),
      new DynamicOptionTagModel({
        id: 'app_Learning:program_duration',
        label: 'Program Duration',
        required: false,
        placeholder: 'Program Duration',
      }),
      new DynamicListModel({
        id: 'app_Learning:program_dates',
        label: 'Program Dates',
        required: false,
        items: [
          new DynamicDatepickerDirectiveModel<string>({
            id: 'app_Learning:program_dates_item',
            label: 'Program Dates',
            readonly: true,
            defaultValue: (new Date()),
            required: false,
          }),
        ],
      }),
      new DynamicFieldHeaderModel<string>({
        id: 'visible-only-to-mgt-header',
        placeholder: 'VISIBLE ONLY TO MGT GROUP',
      }),
      new DynamicOptionTagModel({
        id: 'app_Learning:program_nomination_criteria',
        label: 'Nomination Criteria',
        required: false,
        placeholder: 'Nomination Criteria',
      }),
      new DynamicTextAreaModel({
        id: 'app_Learning:program_nomination_cost',
        label: 'Program Nomination Cost',
        rows: 5,
        required: false,
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'app_Learning:program_logo',
        label: 'Program Logo',
        // formMode: 'create',
        settings: {
          queueLimit: 1,
          layout: 'form-field',
          label: 'Program Logo',
          xpath: 'app_Learning:program_logo',
          placeholder: 'Drop Logo here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'app_Learning:program_photo',
        label: 'Program Photo',
        // formMode: 'create',
        settings: {
          queueLimit: 1,
          layout: 'form-field',
          label: 'Program Photo',
          xpath: 'app_Learning:program_photo',
          placeholder: 'Drop Image here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop Video File(s) here!',
          acceptTypes: '.mov,.mp4,.mp1',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 20,
          xpath: 'file:content',
          placeholder: 'Drop Video File(s) here!',
          acceptTypes: '.mov,.mp4,.mp1',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 20,
          xpath: 'files:files',
          placeholder: 'Drop to upload attachment',
          acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'create',
        settings: {
          enableInput: true,
          multiUpload: true,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          enableInput: false,
          multiUpload: true,
        },
      }),
    ];
  }

}
