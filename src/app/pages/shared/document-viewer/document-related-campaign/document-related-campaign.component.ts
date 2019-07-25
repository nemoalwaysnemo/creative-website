
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
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
export class DocumentRelatedCampaignComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  private subscription: Subscription = new Subscription();
  @Input() document: DocumentModel;
  @ViewChild('nav', { static: true, read: DragScrollComponent }) ds: DragScrollComponent;
  relatedDocs: { type: any, source: any, uid: any }[] = [];

  constructor(
    private router: Router,
    private advanceSearch: AdvanceSearch,
  ) {
  }

  ngOnInit() {
    this.searchRelatedCampaign(this.document);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDocumentType(): string {
    return this.document ? this.document.type.toLowerCase() : '';
  }
  redirectToDoc(doc) {
    this.router.navigate(['/p/redirect'], { queryParams: { url: `/p/creative/asset/${doc.uid}` } });
  }

  private searchRelatedCampaign(doc): void {
    const params: any = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      'The_Loupe_Main:campaign': [doc.get('The_Loupe_Main:campaign')],
    };
    const subscription = this.advanceSearch.request(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.relatedDocs = this.wrapAsCarouselData(res.entries);
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

  wrapAsCarouselData(entries) {
    const carouselData = [];
    entries.forEach((entrie: DocumentModel) => {
      if (entrie.fileMimeType) {
        if (entrie.isVideo()) {
          carouselData.push({ source: entrie.videoPoster, uid: entrie.uid, title: entrie.title });
        } else if (entrie.isAudio() || entrie.isPicture() || entrie.isPdf()) {
          carouselData.push({ source: entrie.thumbnailUrl, uid: entrie.uid, title: entrie.title});
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
