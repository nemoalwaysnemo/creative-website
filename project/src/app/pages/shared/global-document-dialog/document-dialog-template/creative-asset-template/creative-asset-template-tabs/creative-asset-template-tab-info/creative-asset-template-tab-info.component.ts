import { Component, Input, OnDestroy, TemplateRef, Type } from '@angular/core';
import { concatMap, map, share } from 'rxjs/operators';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes, vocabularyFormatter } from '@core/services/helpers';
import { DocumentModel, NuxeoPagination, NuxeoAutomations, NuxeoPermission, UserModel } from '@core/api';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentPageService } from '../../../../../services/document-page.service';


@Component({
  selector: 'creative-asset-template-tab-info',
  styleUrls: ['./creative-asset-template-tab-info.component.scss'],
  templateUrl: './creative-asset-template-tab-info.component.html',
})
export class CreativeAssetTemplateTabInfoComponent implements OnDestroy {

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


  libraryFolder: any = [];

  @Input() deleteRedirectUrl: string = '';

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.loading = false;
      this.documentModel = doc;
    }
  }

  constructor(protected documentPageService: DocumentPageService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleJob(doc: DocumentModel): void {
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

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
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

  // hasAgency(): boolean {
  //   const agency = this.documentModel.get('The_Loupe_Main:agency');
  //   return agency && agency.length > 0 && agency !== null;
  // }

  // hasAgencyFolder(): boolean {
  //   return this.libraryFolder && this.libraryFolder[this.libraryFolder.length - 2] ? true : false;
  // }

  // hasBrandFolder(): boolean {
  //   return this.libraryFolder && this.libraryFolder[this.libraryFolder.length - 1] ? true : false;
  // }

  hasFilter(): boolean {
    return this.documentModel.path.includes('Creative/1. GCL Frontpage/');
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
