import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, NuxeoSearchConstants } from '@core/api';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';
import { ListSearchRowCustomDialogComponent } from '../../../shared/list-search-form';
import { ListSearchRowCustomViewSettings } from '../../../shared/list-search-form/list-search-form.interface';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings, DocumentListViewItem, SearchFilterModel } from '@pages/shared';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings, GlobalDocumentDialogService } from '../../../shared/global-document-dialog';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'creative-brand-campaign-project-mgt',
  templateUrl: './creative-brand-campaign-project-mgt.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', 'creative-brand-campaign-project-mgt.component.scss'],
})
export class CreativeBrandCampaignProjectMgtComponent extends GlobalDocumentViewComponent {

  documents: DocumentModel[];

  target: DocumentModel;

  baseParamsCampaign$: Subject<any> = new Subject<any>();

  baseParamsProject$: Subject<any> = new Subject<any>();

  baseParamsAsset$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_campaign full-width';

  private selectedProject: DocumentModel = null;

  private selectedCampaign: DocumentModel = null;

  campaignFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_prodCredits_production_date_agg', placeholder: 'Year', filterValueFn: (bucket: any) => bucket.docCount > 0 }),
  ];

  projectFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_jobnumber_agg', placeholder: 'Job Number' }),
  ];

  assetFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'the_loupe_rights_contract_mediatypes_agg', placeholder: 'Media Usage' }),
  ];

  searchFormSettingsCampaign: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form-campaign',
    enableQueryParams: true,
  });

  searchFormSettingsProject: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'list-search-form-campaign-project',
  });

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'list-search-form-campaign-asset',
  });

  listViewSettingsCampaign: any = {
    hideHeader: true,
    hideSubHeader: true,
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
          viewType: 'button',
          enableClick: true,
          dialogSettings: new GlobalDocumentDialogSettings({
            components: [
              GLOBAL_DOCUMENT_DIALOG.CUSTOM_CREATIVE_CAMPAIGN_MGT,
              GLOBAL_DOCUMENT_FORM.CREATIVE_CAMPAIGN_FORM,
            ],
            containerType: 'wide-dialog-container',
          }),
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
    },
  };

  listViewSettingsProject: any = {
    hideHeader: true,
    hideSubHeader: true,
    enableCustomClick: true,
    columns: {
      title: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFn: (doc: DocumentModel) => {
            return `
            <div class="project-info">
              <ul>
                <li class="project-title">${doc.title}</li>
                <li class="project-jobnumber">${doc.get('The_Loupe_Main:jobnumber')}</li>
              </ul>
            </div>`;
          },
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'button',
          enableClick: true,
          dialogSettings: new GlobalDocumentDialogSettings({
            components: [
              GLOBAL_DOCUMENT_DIALOG.CUSTOM_CREATIVE_PROJECT_MGT,
              GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MUSIC_FORM,
              GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_PHOTO_FORM,
              GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_STOCK_FORM,
              GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MODEL_FORM,
              GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_IMAGE_FORM,
              GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_VIDEO_FORM,
              GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_AUDIO_FORM,
              GLOBAL_DOCUMENT_FORM.CREATIVE_PROJECT_FORM,
              GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION,
            ],
            containerType: 'wide-dialog-container',
          }),
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
    },
  };

  listViewSettingsAsset: any = {
    hideHeader: true,
    hideSubHeader: true,
    columns: {
      title: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFn: (doc: DocumentModel) => {
            const assettype = doc.get('The_Loupe_Main:assettype') ? `<div class="asset-type">${doc.get('The_Loupe_Main:assettype')}</div>` : '';
            return `
              <div class="asset-info">
                <div class="asset-title">${doc.title}</div>
                <div>
                  ${assettype}
                  <div class="asset-date">${formatDate(doc.get('The_Loupe_ProdCredits:production_date'), 'MMM d, yyyy', 'en-US')}</div>
                </div>
                </div>
              </div>`;
          },
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
          // enableClick: true,
          // dialogSettings: new GlobalDocumentDialogSettings({
          //   components: [
          //     // GLOBAL_DOCUMENT_DIALOG.CUSTOM_CREATIVE_ASSET,
          //   ],
          // }),
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
    },
  };

  listViewBuilderCampaign: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
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

  listViewBuilderProject: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc,
        action: doc,
      }));
    }
    return items;
  }

  listViewBuilderAsset: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc,
        date: doc.get('The_Loupe_ProdCredits:production_date'),
        action: doc,
      }));
    }
    return items;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(activatedRoute, documentPageService);
    // this.dialogParams$.subscribe(p => {console.log(p);
    // });
  }

  isSelectedProject(): boolean {
    return !!this.selectedProject;
  }

  onSelectedCampaign(row: any): void {
    this.selectedProject = null;
    this.selectedCampaign = row.isSelected ? row.selected[0].action : null;
    if (!this.selectedCampaign) {
      this.baseParamsCampaign$.next(this.buildCampaignParams(this.target));
    }
    this.baseParamsProject$.next(this.buildProjectParams(this.target, this.selectedCampaign));
    this.baseParamsAsset$.next(this.buildAssetParams(this.document, this.selectedCampaign));
  }

  onSelectedProject(row: any): void {
    this.selectedProject = row.isSelected ? row.selected[0].action : null;
    if (!this.selectedCampaign) {
      this.baseParamsCampaign$.next(this.buildCampaignParams(this.target, this.selectedProject));
      this.baseParamsAsset$.next(this.buildAssetParams(this.document, null, this.selectedProject));
    } else {
      this.baseParamsAsset$.next(this.buildAssetParams(this.document, this.selectedCampaign, this.selectedProject));
    }
  }

  openDialog(type: string, selectedMenu: string = '', selectedTab: string = ''): void {
    this.globalDocumentDialogService.triggerEvent({ name: 'ButtonClicked', type: 'custom', messageContent: 'Upload Clicked', options: { document: this.selectedProject, selectedMenu, selectedTab } });
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_BRAND_FOLDER_TYPE,
    };
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.getTargetDocumentModel({
        pageSize: 1,
        currentPageIndex: 0,
        ecm_path: doc.path,
        ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_CAMPAIGN_FOLDER_TYPE,
      }).subscribe((target: DocumentModel) => {
        this.target = target;
        this.target.setParent(doc);
        timer(0).subscribe(() => { this.baseParamsCampaign$.next(this.buildCampaignParams(target)); });
        timer(0).subscribe(() => { this.baseParamsProject$.next(this.buildProjectParams(target)); });
        timer(0).subscribe(() => { this.baseParamsAsset$.next(this.buildAssetParams(doc)); });
      });
    }
  }

  protected buildCampaignParams(doc: DocumentModel, campaign?: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_CAMPAIGN_TYPE,
      currentPageIndex: 0,
      ecm_fulltext: '',
      pageSize: 100,
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    if (campaign) {
      const campaigns = this.getCampaignParams(campaign);
      params['the_loupe_main_campaign'] = `["${campaigns.join('", "')}"]`;
    }
    return params;
  }

  protected buildProjectParams(doc: DocumentModel, campaign?: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_PROJECT_TYPE,
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
      currentPageIndex: 0,
      ecm_fulltext: '',
      pageSize: 100,
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    if (campaign) {
      params['the_loupe_main_campaign'] = `["${campaign.uid}"]`;
    }
    return params;
  }

  protected buildAssetParams(doc: DocumentModel, campaign?: DocumentModel, project?: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
      pageSize: 100,
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    if (campaign) {
      params['the_loupe_main_campaign'] = `["${campaign.get('The_Loupe_Main:campaign')}"]`;
      params['ecm_uuid_not_eq'] = doc.uid;
    }

    if (project) {
      params['the_loupe_main_jobtitle_any'] = `["${project.uid}"]`;
      params['ecm_uuid_not_eq'] = doc.uid;
    }
    return params;
  }

  private getCampaignParams(doc: DocumentModel): any {
    let ids = [], campaigns = [];
    const campaign = doc.get('The_Loupe_Main:campaign');
    if (typeof (campaign) === 'string') {
      ids.push(campaign);
    } else {
      ids = ids.concat(campaign);
    }
    campaigns = Array.from(new Set(ids));
    return campaigns;
  }

}
