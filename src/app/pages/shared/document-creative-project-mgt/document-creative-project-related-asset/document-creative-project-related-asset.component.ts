import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentModel, NuxeoApiService } from '@core/api';
import { Subject, timer } from 'rxjs';
import { ListSearchRowCustomViewComponent } from '../../list-search-form';
import { GlobalDocumentDialogService } from '../../global-document-dialog';
import { ListSearchRowCustomViewSettings } from '../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { SuggestionSettings } from '../../directory-suggestion/directory-suggestion-settings';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { CreativeProjectAssetBaseTemplateComponent } from '../../global-document-dialog/document-dialog-template/creative-project-asset-template/creative-project-asset-base-template.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-creative-project-related-asset',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-related-asset.component.html',
})
export class DocumentCreativeProjectRelatedAssetComponent extends CreativeProjectAssetBaseTemplateComponent {

  static readonly NAME: string = 'document-project-package-template';

  formGroup: FormGroup;

  loading: boolean = true;

  doc: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  isPackage: boolean;

  selectedRows: any;

  listViewSettings: any;

  requestData: any = [];

  list: any;

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-creative-project-related-asset',
    enableSearchInput: false,
  });

  defaultSettings: any = {
    hideHeader: true,
    hideSubHeader: true,
    selectMode: 'single',
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        action: doc,
      }));
    }
    return items;
  }

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  @Input()
  set listViewOptions(settings: any) {
    if (settings) {
      this.listViewSettings = Object.assign({}, this.defaultSettings, settings);
    } else {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input()
  set deliverPackage(flag: boolean) {
    if (flag) {
      this.isPackage = flag;
    }
  }

  settingsDays: any = new SuggestionSettings({
    id: 'The_Loupe_Delivery:expiry_days',
    label: 'expiry day',
    viewType: 'suggestion',
    multiple: false,
    placeholder: 'expiry day',
    providerType: SuggestionSettings.DIRECTORY,
    providerName: 'App-Library-Delivery-expiry-days',
  });

  settingsOptions: any = new SuggestionSettings({
    id: 'The_Loupe_Delivery:delivery_config',
    label: 'config',
    multiple: false,
    placeholder: 'config',
    providerType: SuggestionSettings.DIRECTORY,
    providerName: 'App-Library-Delivery-Config',
  });

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected formBuilder: FormBuilder,
    protected nuxeoApi: NuxeoApiService,
  ) {
    super();
  }

  onSelected(row: any): void {
    this.selectedRows = row.selected;
  }

  buildAsset(): void {
    if (this.selectedRows) {
      const uids: string[] = this.selectedRows.map((doc: DocumentModel) => doc.uid);
      if (uids.length > 0) {
      }
    }
  }

  sendPackage(): void {
    this.buildAsset();
    if (!this.formGroup.invalid) {
      // this.setRequest(this.document, this.requestData);
    }
  }

  protected onInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      receiver: ['', [Validators.required, Validators.minLength(10)]],
      subject: ['', [Validators.required, Validators.minLength(10)]],
      expires: ['', [Validators.required]],
      options: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  private setRequest(doc: DocumentModel, message: string): void {
    // const subscription = this.nuxeoApi.operation(NuxeoAutomations.DownloadRequest, { 'uuid': doc.uid, message }).subscribe((res: DocumentModel) => {
    //   const messageType = res.uid ? 'success' : 'error';
    //   const messageContent = res.uid ? 'The request has been successfully sent!' : 'Request failed to send, please try again';
    //   this.globalDocumentDialogService.triggerEvent({ name: `DocumentDownloadRequest`, type: 'callback', messageType, messageContent });
    //   // refresh
    // });
    // this.subscription.add(subscription);
  }

  draftPackage(): void {

  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_uuid_not_eq'] = doc.uid;
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

}
