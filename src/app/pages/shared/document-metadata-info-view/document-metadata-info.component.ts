import { Component, Input, OnDestroy, TemplateRef, Type } from '@angular/core';
import { concatMap, map, share } from 'rxjs/operators';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes, parseCountry } from '@core/services/helpers';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentModelForm } from '../global-document-form/global-document-form.component';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';
import { DocumentModel, NuxeoPagination, NuxeoAutomations, NuxeoApiService, NuxeoPermission, UserService, UserModel } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG } from '../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../global-document-form';
import { NUXEO_DOC_TYPE } from '@environment/environment';

enum assetTypes {
  roadmap = 'App-Disruption-Roadmap-Asset',
  day = 'App-Disruption-Day',
  day_asset = 'App-Disruption-Day-Asset',
  theory = 'App-Disruption-Theory-Asset',
  thinking = 'App-Disruption-Asset',
  case_asset = 'App-BizDev-CaseStudy-Asset',
  thought_asset = 'App-BizDev-Thought-Asset',
  innovation_asset = 'App-Innovation-Asset',
}

@Component({
  selector: 'document-metadata-info',
  styleUrls: ['./document-metadata-info.component.scss'],
  templateUrl: './document-metadata-info.component.html',
})
export class DocumentMetadataInfoComponent implements OnDestroy {

  usageRights: any = {};

  usageLoading: boolean = true;

  jobTitle: string;

  loading: boolean = true;

  jobLoading: boolean = true;

  private subscription: Subscription = new Subscription();

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  downloadPermission$: Observable<boolean> = observableOf(false);

  documentModel: DocumentModel;

  editRedirectUrl: string = this.documentPageService.getCurrentUrl();

  deleteTitle: string = 'Delete';

  deleteDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION] });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: false,
  };

  libraryFolder: any = [];

  @Input() deleteRedirectUrl: string = '';

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.loading = false;
      this.documentModel = doc;
      this.libraryFolder = this.documentModel.breadcrumb.filter((document: DocumentModel) => document.type === 'App-Library-Folder');

      if (this.isCreativeAsset(doc)) {
        this.getUsageRightsStatus(doc);
        // this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
      } else {
        // this.downloadPermission$ = observableOf(true);
      }

      if (this.isDisruptionAsset(doc) || this.isBizDevAsset(doc) || this.isInnovationAsset(doc)) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = doc.hasPermission(NuxeoPermission.Delete);
      }
    }
  }

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
    private documentPageService: DocumentPageService,
    private nuxeoApi: NuxeoApiService,
    private userService: UserService,
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return this.userService.getCurrentUserInfo().pipe(
      concatMap((user: UserModel) => doc.getParentPropertyByOperation('app_global:download_mainfile').pipe(
        map((permission: boolean) => user.canAccess() && permission === true),
      )),
      share(),
    );
  }

  isCreativeAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(doc.type);
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }

  isBizDevAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE).includes(doc.type);
  }

  isInnovationAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE).includes(doc.type);
  }

  getDialogFormSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (doc.type) {
      case assetTypes.roadmap:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM);
        break;
      case assetTypes.day:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_DAY_FORM);
        break;
      case assetTypes.day_asset:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_DAY_ASSET_FORM);
        break;
      case assetTypes.theory:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_HOW_TOS_ASSET_FORM);
        break;
      case assetTypes.thinking:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM);
        break;
      case assetTypes.case_asset:
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_ASSET_FORM);
        break;
      case assetTypes.thought_asset:
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_ASSET_FORM);
        break;
      case assetTypes.innovation_asset:
        components.push(GLOBAL_DOCUMENT_FORM.INNOVATION_ASSET_FORM);
        break;
      default:
        break;
    }
    return new GlobalDocumentDialogSettings({ components });
  }

  getFormTitle(doc: DocumentModel): any {
    let formTitle;
    switch (doc.type) {
      case assetTypes.roadmap:
        formTitle = 'Edit Disruption Roadmap';
        break;
      case assetTypes.day:
        formTitle = 'Edit Disruption Day';
        break;
      case assetTypes.day_asset:
        formTitle = 'Edit Disruption Day Asset';
        break;
      case assetTypes.theory:
        formTitle = 'Edit Disruption How tos';
        break;
      case assetTypes.thinking:
        formTitle = 'Edit Things to Steal';
        break;
      case assetTypes.case_asset:
        formTitle = 'Edit Case Study';
        break;
      case assetTypes.thought_asset:
        formTitle = 'Edit Think Piece';
        break;
      case assetTypes.innovation_asset:
        formTitle = 'Edit Asset';
        break;
      default:
        break;
    }
    return formTitle;
  }

  toggleJob(doc: DocumentModel) {
    if (this.jobTitle === undefined && this.hasJobValue(doc)) {
      this.documentPageService.advanceRequest(this.getRequestParams(doc))
        .subscribe((res: NuxeoPagination) => {
          this.jobTitle = res.entries.map((entry: DocumentModel) => entry.title).join(', ');
          this.jobLoading = false;
        });
    } else {
      this.jobLoading = false;
    }
  }

  parseCountry(list: string[]) {
    return parseCountry(list);
  }

  goBack() {
    this.documentPageService.historyBack();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  private getUsageRightsStatus(doc: DocumentModel): void {
    this.usageLoading = true;
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.GetDocumentURStatus, { 'uuids': doc.uid })
      .subscribe((res: NuxeoPagination) => {
        this.usageRights = res.entries.shift();
        this.usageLoading = false;
      });
    this.subscription.add(subscription);
  }

  private hasJobValue(doc: DocumentModel): boolean {
    return doc.get('The_Loupe_Main:jobtitle').length > 0;
  }

  private getRequestParams(doc: DocumentModel): any {
    const jobTitle = doc.get('The_Loupe_Main:jobtitle');
    return { ecm_uuid: `["${jobTitle.join('", "')}"]`, pageSize: jobTitle.length };
  }

  hasBrand(): boolean {
    const brands = this.documentModel.get('The_Loupe_Main:brand');
    return brands && brands.length > 0 && brands[0] !== null;
  }

  hasAgency(): boolean {
    const agency = this.documentModel.get('The_Loupe_Main:agency');
    return agency && agency.length > 0 && agency !== null;
  }

  hasAgencyFolder(): boolean {
    return this.libraryFolder && this.libraryFolder[this.libraryFolder.length - 2] ? true : false;
  }

  hasBrandFolder(): boolean {
    return this.libraryFolder && this.libraryFolder[this.libraryFolder.length - 1] ? true : false;
  }

  hasFilter(): boolean {
    return this.documentModel.path.includes('Creative/1. GCL Frontpage/');
  }

  goAgencyFolder(): void {
    const agencyId = this.libraryFolder[this.libraryFolder.length - 2].uid;
    this.documentPageService.navigate([`/p/creative/agency/${agencyId}/brand`]);
  }

  goBrandFolder(): void {
    const brandId = this.libraryFolder[this.libraryFolder.length - 1].uid;
    this.documentPageService.navigate([`/p/creative/brand/${brandId}/asset`]);
  }
}
