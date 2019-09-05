import { Component, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService, NuxeoPermission, UserService, UserModel, NuxeoUserGroups } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { getDocumentTypes } from '@core/services';
import { PreviewDialogService } from '../preview-dialog/preview-dialog.service';
import { Router } from '@angular/router';
import { concatMap, map, share } from 'rxjs/operators';

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

  showEdit: boolean = false;

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  downloadPermission$: Observable<boolean> = observableOf(false);

  documentModel: DocumentModel;

  dialogType: string = 'edit';

  @Input() deleteRedirect: string = '';
  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.loading = false;
      this.documentModel = doc;
      if (this.isCreativeAsset(doc)) {
        this.getUsageRightsStatus(doc);
        this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
      } else {
        this.downloadPermission$ = observableOf(true);
      }

      if (this.isDisruptionAsset(doc)) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = doc.hasPermission(NuxeoPermission.Delete);
      }
    }
  }

  constructor(
    private advanceSearch: AdvanceSearch,
    private nuxeoApi: NuxeoApiService,
    private userService: UserService,
    private location: Location,
    private previewDialogService: PreviewDialogService,
    private router: Router,
  ) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return this.userService.getCurrentUserInfo().pipe(
      concatMap((user: UserModel) => doc.getParentProperty('app_global:download_mainfile').pipe(
        map((permission: boolean) => user.hasGroup(NuxeoUserGroups.Everyone) && permission === true),
      )),
      share(),
    );
  }

  isCreativeAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(doc.type);
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }

  toggleJob(doc: DocumentModel) {
    if (this.jobTitle === undefined && this.hasJobValue(doc)) {
      this.advanceSearch.request(this.getRequestParams(doc))
        .subscribe((res: NuxeoPagination) => {
          this.jobTitle = res.entries.map((entry: DocumentModel) => entry.title).join(', ');
          this.jobLoading = false;
        });
    } else {
      this.jobLoading = false;
    }
  }

  parseCountry(list: string[]) {
    return list.map((x) => x.split('/').pop()).join(', ');
  }

  goBack() {
    this.location.back();
  }

  openForm(dialog: any, type: string): void {
    this.dialogType = type;
    this.previewDialogService.open(dialog, this.documentModel);
  }

  onUpdated(document: DocumentModel): void {
    this.router.navigate(['/p/redirect'], { queryParams: { url: decodeURI(this.router.url) } });
  }

  private getUsageRightsStatus(doc: DocumentModel): void {
    this.usageLoading = true;
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.CreativeGetDocumentURStatus, { 'uids': doc.uid })
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
    return agency && agency.length > 0  && agency !== null;
  }

  goAgencyFolder(): void {
    const agencyId = this.documentModel.breadcrumb[this.documentModel.breadcrumb.length - 3].uid;
    this.router.navigate(['p/redirect'], { queryParams: { url: `/p/search/creative/myBrandAsset/${agencyId}` } });
  }

  goBrandFolder(): void {
    this.router.navigate(['p/redirect'], { queryParams: { url: `/p/search/creative/myBrandAsset/${this.documentModel.parentRef}` } });
  }
}
