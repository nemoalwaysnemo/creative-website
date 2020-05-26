import { Component, Input, OnDestroy } from '@angular/core';
import { AdvanceSearchService, NuxeoPagination, DocumentModel } from '@core/api';
import { NUXEO_META_INFO, NUXEO_PATH_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'document-related-project',
  styleUrls: ['./document-related-project.component.scss'],
  templateUrl: './document-related-project.component.html',
})
export class DocumentRelatedProjectComponent implements OnDestroy {

  layout: string = 'my_agency full-width';

  documentModel: DocumentModel;

  loading: boolean = true;

  documents: DocumentModel[];

  noResultText: string = 'No more assets';

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 4,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_TYPES,
    the_loupe_main_brand_any: '',
    ecm_uuid_not_eq: '',
  };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.searchDocuments(doc);
    }
  }

  constructor(private advanceSearchService: AdvanceSearchService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private searchDocuments(doc: DocumentModel): void {
    if (doc.get('The_Loupe_Main:brand')[0] !== null) {
      this.loading = true;
      this.params.the_loupe_main_brand_any = `["${doc.get('The_Loupe_Main:brand').join('", "')}"]`;
      this.params.ecm_uuid_not_eq = doc.uid;
      const subscription = this.advanceSearchService.request(this.params)
        .subscribe((res: NuxeoPagination) => {
          this.loading = false;
          this.documents = res.entries;
        });
      this.subscription.add(subscription);
    } else {
      this.loading = false;
      this.documents = [];
    }
  }
}
