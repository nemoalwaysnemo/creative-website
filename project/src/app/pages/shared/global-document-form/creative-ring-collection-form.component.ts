import { Component } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoAutomations, NuxeoPagination, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicDocumentSelectListModel, DynamicCheckboxModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';
import { of as observableOf, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { ListSearchRowCustomViewComponent } from '../list-search-form-in-dialog';
import { ListSearchRowCustomViewSettings } from '../list-search-form/list-search-form.interface';
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

  constructor(
    private selectableItemService: SelectableItemService,
    protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => {
    if (doc.type === 'App-Library-CreativeRing-Collection') {
      doc.setProperty('The_Loupe_Main:agency', null);
      doc.setProperty('The_Loupe_Main:country', []);
    } else {
      const agency = ctx.targetDocument.get('The_Loupe_Main:agency') ? ctx.targetDocument.get('The_Loupe_Main:agency') : null;
      const country = ctx.targetDocument.get('The_Loupe_Main:country') ? ctx.targetDocument.get('The_Loupe_Main:country') : [];
      doc.setProperty('The_Loupe_Main:agency', !isValueEmpty(doc.get('The_Loupe_Main:agency')) ? doc.get('The_Loupe_Main:agency') : agency);
      doc.setProperty('The_Loupe_Main:country', !isValueEmpty(doc.get('The_Loupe_Main:country')) ? doc.get('The_Loupe_Main:country') : country);
    }
    return observableOf(doc);
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
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
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

  protected getDocumentFormSettings(options: any = {}): DocumentFormSettings {
    return new DocumentFormSettings({
      acceptTypes: 'image/*,.pdf,.mp3,.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
      enableBulkImport: options.formType === 'new',
      docType: this.documentType,
      enableCreateMain: true,
      importSettings: {
        placeholder: 'Upload Assets',
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
                ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
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
        new DynamicCheckboxModel({
          id: 'app_global:enable_thumbnail',
          label: 'Enable Thumbnail',
        }),
        new DynamicDocumentSelectListModel({
          id: 'selected-documents',
          label: 'Selected Documents',
          formMode: 'create',
          layoutPosition: 'bottom',
          settings: {
            documents: options.selectedDocuments,
            listViewSettings: {
              hideHeader: false,
              selectMode: 'multi',
              showCheckbox: true,
              hideSubHeader: true,
              columns: {
                thumbnail: {
                  title: 'Thumbnail',
                  sort: false,
                  type: 'custom',
                  renderComponentData: new ListSearchRowCustomViewSettings({
                    viewType: 'thumbnail',
                    enableClick: true,
                  }),
                  renderComponent: ListSearchRowCustomViewComponent,
                },
                title: {
                  title: 'Title',
                  sort: false,
                },
              },
            },
            listViewBuilder: (docs: DocumentModel[]) => {
              const items = [];
              for (const doc of docs) {
                items.push(new DocumentListViewItem({
                  uid: doc.uid,
                  title: doc.title,
                  thumbnail: doc,
                }));
              }
              return items;
            },
          },
          visibleFn: (): boolean => options.formType === 'add',
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
          visibleFn: (): boolean => options.formType === 'new',
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:brand',
          label: 'Brand',
          required: true,
          settings: {
            placeholder: 'What is this brand?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-CreativeRing-Brands',
            layout: 'direction-horizontal',
          },
          validators: { required: null },
          errorMessages: { required: '' },
          visibleFn: (): boolean => options.formType === 'new',
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
          errorMessages: { required: '' },
          visibleFn: (): boolean => options.formType === 'new',
        }),
      ],
    });
  }

}
