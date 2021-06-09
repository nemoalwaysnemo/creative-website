import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import {
  DynamicBatchUploadModel,
  DynamicInputModel,
  DynamicDragDropFileZoneModel,
  DynamicTextAreaModel,
  DynamicSuggestionModel,
  DynamicDatepickerDirectiveModel,
  DynamicOptionTagModel,
  isString,
} from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';

@Component({
  selector: 'intelligence-asset-form',
  template: `<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class IntelligenceAssetFormComponent extends GlobalDocumentFormComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected documentType: string = 'App-Intelligence-Asset';

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => {
    doc.setProperty('nxtag:tags', doc.get('nxtag:tags').map((tag: string) => ({ label: tag, username: ctx.user.username })));
    return observableOf(doc);
  }

  protected buildTags(doc: DocumentModel): any {
    doc.setProperty('nxtag:tags', (doc.get('nxtag:tags') || []).map((tag: any) => {
      if (!isString(tag)) {
        return tag.label;
      } else {
        return tag;
      }
    }));
    return doc;
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnEdit(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    this.buildTags(doc);
    return observableOf(doc);
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 150,
        placeholder: 'Title',
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
        label: 'Title',
        maxLength: 150,
        placeholder: 'Title',
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
      new DynamicInputModel({
        id: 'The_Loupe_Main:assettype',
        label: 'know\\egde',
        hidden: true,
        defaultValue: 'Intelligence',
        required: false,
      }),
      // new DynamicRadioGroupModel<string>({
      //   id: 'The_Loupe_Main:assettype',
      //   label: 'know\\egde',
      //   options: [
      //     {
      //       label: '\\backslash',
      //       value: '\\backslash',
      //     },
      //     {
      //       label: 'Disruption',
      //       value: 'Disruption',
      //     },
      //     {
      //       label: 'Intelligence',
      //       value: 'Intelligence',
      //     },
      //     {
      //       label: 'Trigger',
      //       value: 'Trigger',
      //     },
      //   ],
      // }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:intelligence_category',
        label: 'Intelligence Category',
        required: true,
        settings: {
          placeholder: 'Select Intelligence Category',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Intelligence-Category',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // new DynamicCheckboxGroupModel({
      //   id: 'app_Edges:intelligence_category',
      //   label: 'Intelligence Category ',
      //   group: [
      //     new DynamicCheckboxModel({
      //       id: 'Brands',
      //       label: 'Brands',
      //     }),
      //     new DynamicCheckboxModel({
      //       id: 'Consumer',
      //       label: 'Consumer',
      //     }),
      //     new DynamicCheckboxModel({
      //       id: 'Industry',
      //       label: 'Industry',
      //     }),
      //     new DynamicCheckboxModel({
      //       id: 'Marketing',
      //       label: 'Marketing',
      //     }),
      //   ],
      // }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:intelligence_type',
        label: 'Intelligence Type',
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Select Intelligence Type',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Intelligence-Type',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // new DynamicRadioGroupModel<string>({
      //   id: 'app_Edges:intelligence_type',
      //   label: 'Intelligence Type',
      //   required: true,
      //   options: [
      //     {
      //       label: '3rd Party Report',
      //       value: '3rd Party Report',
      //     },
      //     {
      //       label: 'Exploration',
      //       value: 'Exploration',
      //     },
      //     {
      //       label: 'Infographic',
      //       value: 'Infographic',
      //     },
      //     {
      //       label: 'Intelligence Update	',
      //       value: 'Intelligence Update	',
      //     },
      //     {
      //       label: 'Newsletter',
      //       value: 'Newsletter',
      //     },
      //     {
      //       label: 'Rapid Immersion',
      //       value: 'Rapid Immersion',
      //     },
      //     {
      //       label: 'Thought Piece',
      //       value: 'Thought Piece',
      //     },
      //   ],
      // }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:internal_external',
        label: 'Internal/External',
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Select Internal/External',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_internal-external',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // new DynamicRadioGroupModel<string>({
      //   id: 'app_Edges:internal_external',
      //   label: 'internal/external',
      //   required: true,
      //   options: [
      //     {
      //       label: 'external',
      //       value: 'external',
      //     },
      //     {
      //       label: 'internal',
      //       value: 'internal',
      //     },
      //   ],
      // }),
      new DynamicTextAreaModel({
        id: 'dc:description',
        label: 'Description',
        rows: 3,
        required: true,
      }),
      new DynamicSuggestionModel<string>({
        id: 'nxtag:tags',
        label: 'Tag',
        required: false,
        settings: {
          addTag: (name: string) => ({ label: name, value: name }),
          placeholder: 'Select/Add a tag',
          providerType: SuggestionSettings.TAG,
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Relevant_Country',
        label: 'Geography',
        required: true,
        settings: {
          placeholder: 'Select Geography',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Geography_TBWA',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Published',
        placeholder: 'Published on',
        readonly: false,
        required: true,
        validators: {
          required: null,
          dateFormatValidator: null,
        },
        errorMessages: {
          required: '{{label}} is required',
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:created_by',
        label: 'Author',
        required: true,
        placeholder: 'Author',
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        required: true,
        settings: {
          placeholder: 'Select Industry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        settings: {
          multiple: false,
          placeholder: 'Select Agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Backslash Category',
        required: false,
        settings: {
          placeholder: 'Select Backslash Category',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: false,
        settings: {
          placeholder: 'Select Edges',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 25,
          placeholder: 'Drop Image/PDF/Video File(s) here!',
          acceptTypes: 'image/*,.pdf,.mp4',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Image/PDF here!',
          acceptTypes: 'image/*,.pdf',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'files:files',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop to upload attachment',
          acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'create',
        settings: {
          enableForm: true,
          enableAction: true,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          enableForm: false,
          enableAction: false,
        },
      }),
    ];
  }

}
