import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable } from 'rxjs';
import {
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicOptionTagModel,
  DynamicSuggestionModel,
  DynamicBatchUploadModel,
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
        required: true,
        hidden: false,
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
      new DynamicTextAreaModel({
        id: 'app_Learning:program_purpose',
        label: 'Program Purpose',
        rows: 5,
        required: false,
      }),
      new DynamicTextAreaModel({
        id: 'app_Learning:program_experience_level',
        label: 'Program Experience Level',
        rows: 5,
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
        id: 'app_Learning:program_duration',
        label: 'Program Duration',
        required: false,
        placeholder: 'Program Duration',
      }),
      new DynamicOptionTagModel({
        id: 'app_Learning:program_date',
        label: 'Program Dates',
        required: false,
        placeholder: 'Program Dates',
      }),
      new DynamicFieldHeaderModel<string>({
        id: 'visible-only-to-program-nominators-group-header',
        placeholder: 'VISIBLE ONLY TO PROGRAM NOMINATORS GROUP',
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
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          // layout: 'form-field',
          label: 'Program Logo',
          xpath: 'app_Learning:program_logo',
          placeholder: 'Drop Logo here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        label: 'Program Video',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          // layout: 'form-field',
          placeholder: 'Drop Video File here!',
          acceptTypes: '.mov,.mp4,.mp1',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'app_Learning:program_photo',
        label: 'Program Photo',
        layoutPosition: 'right',
        settings: {
          queueLimit: 20,
          // layout: 'form-field',
          label: 'Program Photo',
          xpath: 'app_Learning:program_photo',
          placeholder: 'Drop Image(s) here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        settings: {
          enableForm: false,
          enableAction: true,
        },
      }),
    ];
  }

}
