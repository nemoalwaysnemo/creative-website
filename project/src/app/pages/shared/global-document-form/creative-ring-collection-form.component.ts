import { Component } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoAutomations, NuxeoPagination, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, NgFileService } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';
import { of as observableOf, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { SelectableItemService } from '../document-selectable/selectable-item/selectable-item.service';
import { isValueEmpty } from '@core/services/helpers';

@Component({
  selector: 'creative-ring-collection-form',
  templateUrl: './creative-ring-collection-form.component.html',
  styleUrls: ['./global-document-form.component.scss'],
})
export class CreativeRingCollectionFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ring-collection-form';

  protected documentType: string = 'App-Library-CreativeRing-Collection';

  enableUpload: boolean = false;

  constructor(
    private ngFileService: NgFileService,
    private selectableItemService: SelectableItemService,
    protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => {
    if (NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE.includes(doc.type)) {
      doc.setProperty('The_Loupe_Main:agency', ctx.sharedFormValue['The_Loupe_Main:agency'] || []);
      doc.setProperty('The_Loupe_Main:country', ctx.sharedFormValue['The_Loupe_Main:country'] || null);
      doc.setProperty('The_Loupe_Main:brand', ctx.sharedFormValue['The_Loupe_Main:brand'] || []);
      doc.setProperty('The_Loupe_Main:assettype', ctx.sharedFormValue['The_Loupe_Main:assettype'] || null);
      return observableOf(doc);
    } else if (NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(doc.type)) {
      const e = (doc.get('The_Loupe_Main:brand') || []).filter((x: any) => typeof x !== 'string').map((x: any) => x.value);
      if (e.length > 0) {
        const entries = '[' + e.map((x: any) => '{"id": "' + x + '", "label": "' + x + '"}').join(', ') + ']';
        return this.documentPageService.operation(NuxeoAutomations.AddDirectoryEntries, { directoryName: 'App-Library-CreativeRing-Brands', entries }).pipe(
          map((res: NuxeoPagination) => doc.setProperty('The_Loupe_Main:brand', doc.get('The_Loupe_Main:brand').filter((x: any) => typeof x === 'string').concat(res.entries))),
        );
      }
      return observableOf(doc);
    }
  };

  afterFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => {
    this.selectableItemService.clear();
    const collection = ctx.performedDocuments[0];
    const assetIds = ctx.formValue['selected-documents'] ? ctx.formValue['selected-documents'] : ctx.performedDocuments.slice(1).map((d: DocumentModel) => d.uid);
    if (assetIds.length > 0) {
      return this.documentPageService.operation(NuxeoAutomations.AddAssetsToCollection, { collection: collection.uid }, assetIds).pipe(
        map(_ => ctx),
      );
    } else {
      return observableOf(ctx);
    }
  };

  private getPreference(doc: DocumentModel, user: UserModel): Observable<any> {
    const params = {
      ecm_fulltext: '',
      currentPageIndex: 0,
      pageSize: 1,
      the_loupe_main_companycode: user.companycode,
      ecm_path: this.documentPageService.getConfig('path:CREATIVE_TBWA_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_AGENCY_FOLDER_TYPE,
    };
    if (user.companycode) {
      return this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(
        map((res: NuxeoPagination) => this.updatePreference(doc, user, res.entries.shift())));
    }
  }

  private updatePreference(doc: DocumentModel, user: UserModel, val: DocumentModel): DocumentModel {
    const properties = Object.assign({}, doc.properties, {
      'The_Loupe_Main:agency': val.get('The_Loupe_Main:agency'),
      'The_Loupe_Main:country': this.formatData(user.get('fullCountry')),
    });
    return new DocumentModel({ uid: doc.uid, path: doc.path, title: doc.title, parentRef: doc.parentRef, type: this.getDocType(), properties });
  }

  protected formatData(data: any): string[] {
    let formats = [];
    if (typeof (data) === 'string') {
      formats.push(data);
    } else {
      formats = formats.concat(data);
    }
    data = Array.from(new Set(formats));
    return data;
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return observableOf(doc).pipe(concatMap((d: DocumentModel) => this.getPreference(d, user)));
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (!this.enableUpload && event.action === 'SharedValueChanged' && this.sharedModelValid(event.formValue)) {
      this.enableUpload = true;
    }
    if (event.action === 'Created') {
      event.redirectUrl = '/p/creative/ring/collection/:uid/asset';
    }
    return observableOf(event);
  }

  protected getDocumentFormSettings(options: any = {}): DocumentFormSettings {
    return new DocumentFormSettings({
      acceptTypes: 'image/*,.pdf,.mp3,.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
      enableBulkImport: true,
      docType: this.documentType,
      enableCreateMain: true,
      buttonGroup: [
        {
          label: 'Upload',
          name: 'save',
          type: 'save',
        },
        {
          label: 'Cancel',
          name: 'cancle',
          type: 'cancle',
        },
      ],
      importSettings: {
        placeholder: 'Upload Assets',
        batchUploadLayout: 'common-table ringCollection',
        getDocType: (item: NuxeoUploadResponse): string => {
          if (['video'].some(x => item.mimeType.includes(x))) {
            return 'App-Library-Video';
          } else if (['image', 'pdf'].some(x => item.mimeType.includes(x))) {
            return 'App-Library-Image';
          } else if (['audio'].some(x => item.mimeType.includes(x))) {
            return 'App-Library-Audio';
          }
        },
      },
      formModel: [
        new DynamicInputModel({
          id: 'dc:title',
          label: 'Collection Title',
          maxLength: 150,
          placeholder: 'Title',
          autoComplete: 'off',
          formMode: 'create',
          required: true,
          validators: {
            required: null,
            minLength: 4,
          },
          asyncValidators: {
            uniqueDocumentValidator: {
              documentPageService: this.documentPageService,
              searchParams: {
                ecm_path: this.documentPageService.getConfig('path:CREATIVE_BASE_FOLDER_PATH'),
                ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
              },
            },
          },
          errorMessages: {
            required: '{{label}} is required',
            minLength: 'At least 4 characters',
            uniqueDocumentValidator: 'The collection {{value}} already exists, please change one',
          },
          // updateOn: DynamicFormHook.Blur,
        }),
        new DynamicInputModel({
          id: 'The_Loupe_Main:collection_type',
          label: 'Collection Type',
          required: false,
          hidden: true,
          defaultValue: 'Asset Collection',
        }),
      ],
      sharedModel: [
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:agency',
          label: 'Agency',
          defaultValueFn: (ctx: DocumentFormContext): any => ctx.currentDocument.getParent().get('The_Loupe_Main:agency'),
          settings: {
            multiple: false,
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'GLOBAL_Agencies',
          },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:country',
          label: 'Country',
          defaultValueFn: (ctx: DocumentFormContext): any => ctx.currentDocument.getParent().get('The_Loupe_Main:country'),
          settings: {
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'GLOBAL_Countries',
          },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:brand',
          label: 'Default Brand',
          required: true,
          settings: {
            placeholder: 'Set Brand',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-CreativeRing-Brands',
          },
          validators: { required: null },
          errorMessages: { required: 'Brand is required' },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:assettype',
          label: 'Default Asset Type',
          required: true,
          settings: {
            multiple: false,
            placeholder: 'Set Asset Type',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-MediaTypes-Mixed',
          },
          validators: { required: null },
          errorMessages: { required: 'Asset Type is required' },
        }),
      ],
      importModel: [
        new DynamicInputModel({
          id: 'dc:title',
          label: 'Title',
          maxLength: 150,
          placeholder: 'Title',
          autoComplete: 'off',
          required: true,
          settings: {
            layout: 'direction-horizontal',
          },
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
          id: 'The_Loupe_Main:brand',
          label: 'Brand',
          required: true,
          settings: {
            layout: 'direction-horizontal',
            placeholder: 'What is this brand?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-CreativeRing-Brands',
            addTag: (name: string) => ({ value: name, new: true }),
          },
          validators: { required: null },
          errorMessages: { required: '{{label}} is required' },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:assettype',
          label: 'Asset Type',
          required: true,
          settings: {
            multiple: false,
            placeholder: 'What is this asset?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-MediaTypes-Mixed',
            layout: 'direction-horizontal',
          },
          validators: { required: null },
          errorMessages: { required: '{{label}} is required' },
        }),
      ],
    });
  }

  private sharedModelValid(formValue: any): boolean {
    let requiredAllFilled = true;
    Object.entries(formValue).forEach(([key, value]) => {
      const valid = Object.values(this.getDocumentFormSettings().sharedModel).find((obj) => {
        return obj.name === key && obj.required === true && isValueEmpty(value);
      });
      if (!!valid) {
        requiredAllFilled = false;
      }
    });
    return requiredAllFilled;
  }

  openFileSelectWindow(event: any): void {
    this.ngFileService.triggerEvent({ name: 'openSelectWindow', type: 'ng-file', data: { event } });
  }
}
