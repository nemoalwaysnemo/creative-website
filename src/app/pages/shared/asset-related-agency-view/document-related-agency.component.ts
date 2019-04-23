import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'document-related-agency',
  styleUrls: ['./document-related-agency.component.scss'],
  templateUrl: './document-related-agency.component.html',
})
export class DocumentRelatedAgencyComponent implements OnInit, OnDestroy {

  @Input() document: DocumentModel;

  loading: boolean = true;

  documents: DocumentModel[];

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 4,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    the_loupe_main_agency: '',
    ecm_uuid_exclude: '',
  };

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.params.the_loupe_main_agency = this.document.get('The_Loupe_Main:agency');
    this.params.ecm_uuid_exclude = this.document.uid;
    this.search(this.params);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.loading = false;
        this.documents = res.entries;
      });
    this.subscription.add(subscription);
  }
}
