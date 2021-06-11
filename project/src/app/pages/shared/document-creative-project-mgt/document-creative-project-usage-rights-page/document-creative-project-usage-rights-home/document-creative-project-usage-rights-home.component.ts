import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentModel, GlobalSearchParams, NuxeoPagination, UserModel } from '@core/api';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { ProjectMgtNavigationSettings } from '../../shared/document-creative-project-navigation/document-creative-project-navigation.interface';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { of as observableOf, Observable } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { ACTIONS, CONTRACT_YTPES } from '../document-creative-project-usage-rigths-type-config';
import { concatMap, map } from 'rxjs/operators';
import { DocumentFormStatus } from '@pages/shared/document-form/document-form.interface';

@Component({
  selector: 'document-creative-project-usage-rights-home',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-usage-rights-page.component.scss'],
  templateUrl: './document-creative-project-usage-rights-home.component.html',
})
export class DocumentCreativeProjectUsageRightHomeComponent extends DocumentCreativeProjectMgtBaseComponent implements OnInit {

  actions: NbMenuItem[] = ACTIONS;

  selectAssets: DocumentModel[] = [];

  usageRightNavSettings: ProjectMgtNavigationSettings;
  assetNavSettings: ProjectMgtNavigationSettings;

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
    this.subscribeHomeEvents();
  }

  ngOnInit(): void {
    this.onClickLink();
  }

  changeMenuView(item: NbMenuItem, type: string = 'view', formMode: string = 'create'): void {
    this.triggerChangeView(item.id, type,
      new CreativeProjectMgtSettings({
        document: this.document,
        dialogDocument: this.document,
        project: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'usage-rights-Page',
        homeView: 'usage-rights-home-view',
        formMode,
        showMessageBeforeSave: false,
        buttonGroup: [
          {
            label: 'create',
            name: 'create',
            type: 'custom',
            disabled: (status: DocumentFormStatus) => status.submitted || !status.formValid,
            triggerSave: true,
          },
          {
            label: 'cancel',
            name: 'cancel',
            type: 'cancel',
          },
        ],
      }));
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.usageRightNavSettings = this.buildUsageRightNavSettings(doc);
    this.assetNavSettings = this.buildAssetNavSettings(doc);
    console.log(doc.getParent('brand').uid);
    return observableOf(doc).pipe(
      concatMap(_ =>
        this.documentPageService.advanceRequest(new GlobalSearchParams({
          pageSize: 1,
          currentPageIndex: 0,
          ecm_uuid: `["${doc.getParent('brand').uid}"]`,
        })).pipe(
          map((res: NuxeoPagination) => {
            const brand = res.entries.shift();
            return brand;
          }),
        ),
      ),
      concatMap(brand =>
        this.documentPageService.advanceRequest(new GlobalSearchParams({
          pageSize: 1,
          currentPageIndex: 0,
          ecm_path: brand.path,
          ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_FOLDER_TYPE,
        })).pipe(
          map((res: NuxeoPagination) => {
            const target = res.entries.shift();
            target.setParent(brand);
            return target;
          }),
        ),
      ),
    );
  }

  private buildUsageRightNavSettings(doc: DocumentModel): any {
    return new ProjectMgtNavigationSettings({
      currentPage: 'usage-rights-Page',
      searchFormParams: this.buildUsageRightParams(doc, doc.getParent('brand')),
      searchFormSettings: new GlobalSearchFormSettings({
        source: 'document-creative-project-usage-right',
        searchGroupPosition: 'right',
        enableSearchForm: false,
      }),
    });
  }

  private buildAssetNavSettings(doc: DocumentModel): any {
    return new ProjectMgtNavigationSettings({
      currentPage: 'usage-rights-Page',
      searchFormParams: this.buildAssetParams(doc, doc.getParent('brand')),
      searchFormSettings: new GlobalSearchFormSettings({
        source: 'document-creative-project-asset',
        searchGroupPosition: 'right',
        schemas: ['dublincore', 'The_Loupe_Talent', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
        enableSearchForm: false,
      }),
    });
  }

  private buildUsageRightParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_CONTRACT_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

  private buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
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

  private subscribeHomeEvents(): void {
    const subscription = this.documentPageService.onEventType('list-search-row-custom-view').subscribe((event: GlobalEvent) => {
      this.triggerChangeView('asset-detail-view', 'view', new CreativeProjectMgtSettings({ project: this.document, document: event.data.document }));
    });
    this.subscription.add(subscription);
  }

  onSelectAsset(assets: DocumentModel[]): void {
    this.selectAssets = assets;
  }

  onClickLink(): void {
    const subscription = this.documentPageService.onEvent('LinkAssetClick')
    .pipe(
      map((res) => res.data),
    ).subscribe(data => {
      this.selectAssets.forEach(asset => {
        this.linkAssetToContract(asset, data);
      });
    });
    this.subscription.add(subscription);
  }

  linkAssetToContract(asset: DocumentModel, contract: any): void {
    const type = CONTRACT_YTPES[contract.type];
    const UR_ids: string[] = asset.get(type);
    if (UR_ids.indexOf(contract.uid) === -1){
      const opt = {};
      UR_ids.push(contract.uid);
      opt[type] = UR_ids;
      asset.set(opt).save().subscribe(doc => {
        console.log(doc);
      });
    }else{
      console.log(contract.uid);
    }
  }
}
