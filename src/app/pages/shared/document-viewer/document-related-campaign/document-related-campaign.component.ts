
import { Component, Input, ViewChild, OnDestroy } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { DocumentModel, NuxeoPageProviderParams, NuxeoPagination, AdvanceSearch } from '@core/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NUXEO_META_INFO } from '@environment/environment';
@Component({
  selector: 'document-related-campaign',
  styleUrls: ['./document-related-campaign.component.scss'],
  templateUrl: './document-related-campaign.component.html',
})
export class DocumentRelatedCampaignComponent implements OnDestroy {
  loading: boolean = true;
  private subscription: Subscription = new Subscription();
  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.loading = true;
      this.searchRelatedCampaign(doc);
    }
  }
  @ViewChild('nav', { static: true, read: DragScrollComponent }) ds: DragScrollComponent;
  relatedDocs: { type: any, source: any, uid: any }[] = [];

  constructor(
    private router: Router,
    private advanceSearch: AdvanceSearch,
  ) {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDocumentType(): string {
    return this.document ? this.document.type.toLowerCase() : '';
  }
  redirectToDoc(doc: DocumentModel) {
    this.router.navigate(['/p/redirect'], { queryParams: { url: `/p/creative/asset/${doc.uid}` } });
  }
  private searchRelatedCampaign(doc: DocumentModel): void {
    const campaign = doc.get('The_Loupe_Main:campaign');
    if (campaign == null) {
      this.loading = false;
      this.relatedDocs = [];
    } else {
      const params: any = {
        pageSize: 10,
        currentPageIndex: 0,
        ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
        the_loupe_main_campaign: `["${campaign}"]`,
        ecm_uuid_not_eq: doc.uid,
      };
      const subscription = this.advanceSearch.request(new NuxeoPageProviderParams(params))
        .subscribe((res: NuxeoPagination) => {
          this.relatedDocs = this.wrapAsCarouselData(res.entries);
          this.loading = false;
        });
      this.subscription.add(subscription);
    }
  }

  private wrapAsCarouselData(entries: DocumentModel[]) {
    const carouselData = [];
    entries.forEach((entrie: DocumentModel) => {
      if (entrie.fileMimeType) {
        if (entrie.isVideo()) {
          carouselData.push({ source: entrie.videoPoster, uid: entrie.uid, title: entrie.title });
        } else if (entrie.isAudio() || entrie.isPicture() || entrie.isPdf()) {
          carouselData.push({ source: entrie.thumbnailUrl, uid: entrie.uid, title: entrie.title });
        }
      }
    });
    return carouselData;
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

}
