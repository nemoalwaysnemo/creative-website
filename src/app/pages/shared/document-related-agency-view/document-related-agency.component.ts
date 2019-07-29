import { Component, Input, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'document-related-agency',
  styleUrls: ['./document-related-agency.component.scss'],
  templateUrl: './document-related-agency.component.html',
})
export class DocumentRelatedAgencyComponent implements OnDestroy {

  layout: string = 'quarter full-width';

  documentModel: DocumentModel;

  loading: boolean = true;

  documents: DocumentModel[];

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 4,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    the_loupe_main_agency: '',
    ecm_uuid_not_eq: '',
  };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.searchDocuments(doc);
    }
  }

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private searchDocuments(doc: DocumentModel): void {
    this.loading = true;
    this.params.the_loupe_main_agency = doc.get('The_Loupe_Main:agency');
    this.params.the_loupe_main_brand_not_in = `["${doc.get('The_Loupe_Main:brand')}"]`;
    this.params.ecm_uuid_not_eq = doc.uid;
    const subscription = this.advanceSearch.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.loading = false;
        this.documents = res.entries;
      });
    this.subscription.add(subscription);
  }
}
