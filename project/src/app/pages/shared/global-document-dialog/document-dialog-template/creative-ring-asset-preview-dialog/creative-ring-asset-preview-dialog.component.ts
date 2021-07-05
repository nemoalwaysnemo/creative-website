import { Component, ViewChild, TemplateRef } from '@angular/core';
import { vocabularyFormatter } from '@core/services/helpers';
import { Observable, of as observableOf, combineLatest, Subject, Subscription, timer } from 'rxjs';
import { concatMap, map, share } from 'rxjs/operators';
import { DocumentModel, UserModel, NuxeoPermission } from '@core/api';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'creative-ring-asset-preview-dialog',
  styleUrls: ['./creative-ring-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './creative-ring-asset-preview-dialog.component.html',
})
export class CreativeRingAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  @ViewChild('creativeThumbnailItemView', { static: true }) private creativeItemView: TemplateRef<any>;

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  downloadPermission$: Observable<boolean> = observableOf(false);

  attachments: { type: string, url: string, title: string }[] = [];

  viewerSettings: any = {
  };

  hiddenDialogInfo: boolean = false;

  searchFormBrandSettings: GlobalSearchFormSettings;

  forbiddenParams: string[] = [
    'app_global_networkshare',
  ];
  baseParamsBrand$: Subject<any> = new Subject<any>();

  baseParamsAgency$: Subject<any> = new Subject<any>();

  tabItems = [
    {
      name: 'Creative',
      layout: 'creative',
      children: [
        {
          name: 'Brand',
          layout: 'brand',
          enableSearchInput: false,
          params: {
            pageSize: 4,
            ecm_path: NUXEO_PATH_INFO.CREATIVE_RING_PATH,
            ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_TYPES,
          },
          provider: NUXEO_DOC_TYPE.BASE_SEARCH_PROVIDER,

        },
        {
          name: 'Agency',
          layout: 'agency',
          enableSearchInput: false,
          params: {
            pageSize: 4,
            // app_global_networkshare: true,
            ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
            ecm_path: NUXEO_PATH_INFO.CREATIVE_RING_PATH,
          },
          provider: NUXEO_DOC_TYPE.BASE_SEARCH_PROVIDER,
        },
      ],
    },
  ];

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    this.documentPageService.onEventType('knowledge-inner-dialog').subscribe((e: GlobalEvent) => {
      if (e.name === 'Opened') {
        this.hiddenDialogInfo = true;
      } else {
        this.hiddenDialogInfo = false;
      }
    });
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.shareUrl = this.buildShareUrl(doc);
      this.attachments = doc.getAttachmentList();
      this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
      timer(0).subscribe(() => { this.baseParamsBrand$.next(this.buildBrandAssetParams(doc)); });
    }
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: true,
      enablePreview: true,
      enableDetail: true,
      enableKnowledgeRelated: false,
    };
  }

  private triggerBrandSearch(doc: DocumentModel, item: any): void {
    this.searchFormBrandSettings = new GlobalSearchFormSettings({
      source: 'document-related-brand',
      searchGroupPosition: 'right',
      pageProvider: item.provider,
      enableSearchInput: item.enableSearchInput,
      forbiddenSearchParams: this.forbiddenParams,
    });
    this.baseParamsBrand$.next(this.getRelatedBrandSearchParams(doc, item));
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl('creative/asset/' + doc.uid);
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return combineLatest([
      doc.hasPermission(NuxeoPermission.ReadWrite),
      doc.hasPermission(NuxeoPermission.Everything),
      this.documentPageService.getCurrentUser().pipe(
        concatMap((user: UserModel) => doc.getParentPropertyByOperation('app_global:download_mainfile').pipe(
          map((permission: boolean) => user.canAccess() && permission === true),
        )),
      )]).pipe(
        map(results => (results[0] || results[1] || results[2])),
        share(),
      );
  }

  isVideoAsset(doc: DocumentModel): boolean {
    return (doc.type === 'App-Library-Video') ? true : false;
  }

  private getRelatedBrandSearchParams(doc: DocumentModel, item: any): any {
    const brands = doc.get('The_Loupe_Main:brand');
    return Object.assign({ ecm_uuid_not_eq: doc.uid, the_loupe_main_brand_any: brands.length !== 0 ? `["${doc.get('The_Loupe_Main:brand').join('", "')}"]` : '' }, item.params);
  }

  protected buildBrandAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_path: NUXEO_PATH_INFO.CREATIVE_RING_PATH,
      ecm_uuid_not_eq: doc.uid,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      the_loupe_main_brand_any: `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`,
    };
    return params;
  }
}
