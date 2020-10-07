import { Component, Input, OnDestroy, TemplateRef, Type } from '@angular/core';
import { concatMap, map, share } from 'rxjs/operators';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes, vocabularyFormatter } from '@core/services/helpers';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentModelForm } from '../global-document-form/global-document-form.component';
import { DocumentModel, NuxeoPagination, NuxeoAutomations, NuxeoPermission, UserModel } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../global-document-form';
import { NUXEO_DOC_TYPE } from '@environment/environment';

enum AssetTypes {
  roadmap = 'App-Disruption-Roadmap-Asset',
  day = 'App-Disruption-Day',
  dayAsset = 'App-Disruption-Day-Asset',
  theory = 'App-Disruption-Theory-Asset',
  thinking = 'App-Disruption-Asset',
  caseAsset = 'App-BizDev-CaseStudy-Asset',
  thoughtAsset = 'App-BizDev-Thought-Asset',
  innovationAsset = 'App-Innovation-Asset',
  intelligenceAsset = 'App-Intelligence-Asset',
  backslashEdgeAsset = 'App-Backslash-Edges-Asset',
  backslashResourceAsset = 'App-Backslash-Resources-Asset',
  backslashTriggerAsset = 'App-Edges-Trigger',
  backslashReportAsset = 'App-Backslash-Case-Study',
  creativeAudio = 'App-Library-Audio',
  creativeImage = 'App-Library-Image',
  creativeVideo = 'App-Library-Video',
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

      if (this.isDisruptionAsset(doc) || this.isIntelligenceAsset(doc) || this.isBizDevAsset(doc) || this.isInnovationAsset(doc) || this.isBackslashAsset(doc) || this.isCreativeAsset(doc)) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = doc.hasPermission(NuxeoPermission.Delete);
      }
    }
  }

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
    private documentPageService: DocumentPageService,
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return this.documentPageService.getCurrentUser().pipe(
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

  isDisruptionRoadmapAsset(doc: DocumentModel): boolean {
    if (this.isDisruptionAsset(doc)) {
      return doc && getDocumentTypes(NUXEO_DOC_TYPE.DISRUPTION_ROADMAP_TYPE).includes(doc.type);
    }
    return false;
  }

  isBackslashAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BACKSLASH_ASSET_TYPE).includes(doc.type);
  }


  getDialogFormSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (doc.type) {
      case AssetTypes.roadmap:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM);
        break;
      case AssetTypes.day:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_DAY_FORM);
        break;
      case AssetTypes.dayAsset:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_DAY_ASSET_FORM);
        break;
      case AssetTypes.theory:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_HOW_TOS_ASSET_FORM);
        break;
      case AssetTypes.thinking:
        components.push(GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM);
        break;
      case AssetTypes.caseAsset:
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_ASSET_FORM);
        break;
      case AssetTypes.thoughtAsset:
        components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_ASSET_FORM);
        break;
      case AssetTypes.innovationAsset:
        components.push(GLOBAL_DOCUMENT_FORM.INNOVATION_ASSET_FORM);
        break;
      case AssetTypes.intelligenceAsset:
        components.push(GLOBAL_DOCUMENT_FORM.INTELLIGENCE_ASSET_FORM);
        break;
      case AssetTypes.backslashEdgeAsset:
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_EDGES_ASSET_FORM);
        break;
      case AssetTypes.backslashResourceAsset:
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_RESOURCES_ASSET_FORM);
        break;
      case AssetTypes.backslashTriggerAsset:
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_TRIGGER_FORM);
        break;
      case AssetTypes.backslashReportAsset:
        components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_CASE_STUDY_ASSET_FORM);
        break;
      case AssetTypes.creativeAudio:
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_AUDIO_FORM);
        break;
      case AssetTypes.creativeImage:
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_IMAGE_FORM);
        break;
      case AssetTypes.creativeVideo:
        components.push(GLOBAL_DOCUMENT_FORM.CREATIVE_ASSET_VIDEO_FORM);
        break;
      default:
        break;
    }
    return new GlobalDocumentDialogSettings({ components });
  }

  getFormTitle(doc: DocumentModel): any {
    let formTitle;
    switch (doc.type) {
      case AssetTypes.roadmap:
        formTitle = 'Edit Disruption Roadmap';
        break;
      case AssetTypes.day:
        formTitle = 'Edit Disruption Day';
        break;
      case AssetTypes.dayAsset:
        formTitle = 'Edit Disruption Day Asset';
        break;
      case AssetTypes.theory:
        formTitle = 'Edit Disruption How tos';
        break;
      case AssetTypes.thinking:
        formTitle = 'Edit Things to Steal';
        break;
      case AssetTypes.caseAsset:
        formTitle = 'Edit Case Study';
        break;
      case AssetTypes.thoughtAsset:
        formTitle = 'Edit Think Piece';
        break;
      case AssetTypes.innovationAsset:
        formTitle = 'Edit Asset';
        break;
      case AssetTypes.intelligenceAsset:
        formTitle = 'Edit Asset';
        break;
      case AssetTypes.backslashEdgeAsset:
        formTitle = 'Edit Edge Asset';
        break;
      case AssetTypes.backslashResourceAsset:
        formTitle = 'Edit Resource Asset';
        break;
      case AssetTypes.backslashTriggerAsset:
        formTitle = 'Edit Trigger';
        break;
      case AssetTypes.backslashReportAsset:
        formTitle = 'Edit Report';
        break;
      case AssetTypes.creativeAudio:
        formTitle = 'Edit Audio';
        break;
      case AssetTypes.creativeImage:
        formTitle = 'Edit Image';
        break;
      case AssetTypes.creativeVideo:
        formTitle = 'Edit Video';
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

  vocabularyFormatter(list: string[]) {
    return vocabularyFormatter(list);
  }

  goBack() {
    this.documentPageService.historyBack();
  }

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: closeOnBackdropClick });
  }

  private getUsageRightsStatus(doc: DocumentModel): void {
    this.usageLoading = true;
    const subscription = this.documentPageService.operation(NuxeoAutomations.GetDocumentURStatus, { 'uuids': doc.uid, 'entityType': 'asset' })
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

  goToAgencyFolder(): void {
    const agencyId = this.libraryFolder[this.libraryFolder.length - 2].uid;
    this.documentPageService.navigate([`/p/creative/agency/${agencyId}/showcase`]);
  }

  goToBrandFolder(): void {
    const brandId = this.libraryFolder[this.libraryFolder.length - 1].uid;
    this.documentPageService.navigate([`/p/creative/brand/${brandId}/asset`]);
  }

  getTags(): string {
    const tags = this.documentModel.get('nxtag:tags');
    return tags.map(tag => {
      if (typeof (tag) === 'string') {
        return tag;
      } else {
        return tag.label;
      }
    }).join(', ');
  }
}
