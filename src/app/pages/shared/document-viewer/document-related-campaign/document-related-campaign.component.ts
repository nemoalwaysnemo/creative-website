
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { DocumentModel, NuxeoPageProviderParams, NuxeoPagination } from '@core/api';
import { AdvanceSearch } from '@core/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'document-related-campaign',
  styleUrls: ['./document-related-campaign.component.scss'],
  templateUrl: './document-related-campaign.component.html',
})
export class DocumentRelatedCampaignComponent implements OnInit {
  loading = true;
  private subscription: Subscription = new Subscription();
  @Input() document: DocumentModel;
  @ViewChild('nav', { static: true, read: DragScrollComponent }) ds: DragScrollComponent;
  relatedDocs: { type: any, source: any, uid: any }[] = [];

  constructor(
    private router: Router,
    protected advanceSearch: AdvanceSearch,
  ) { }

  ngOnInit() {
    this.relatedDocs.push({ type: '', source: this.document.thumbnailUrl, uid: this.document.uid });
    this.searchRelatedCampaign(this.document);
  }

  getDocumentType(): string {
    return this.document ? this.document.type.toLowerCase() : '';
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  jumpToDoc(doc) {
    this.router.navigate(['/p/redirect'], { queryParams: { url: `/p/creative/asset/${doc.uid}` } });
  }

  private searchRelatedCampaign(doc): void {
    const params: any = {
      pageSize: 20,
      currentPageIndex: 0,
      ecm_primaryType: ['App-Library-Image', 'App-Library-Video', 'App-Library-Audio'],
      'The_Loupe_Main:campaign': doc.get('The_Loupe_Main:campaign'),
    };
    const subscription = this.advanceSearch.request(new NuxeoPageProviderParams(params))
      .subscribe((res: NuxeoPagination) => {
        const carouselData = [];
        res.entries.forEach((entrie: DocumentModel) => {
          if (entrie.fileMimeType) {
            if (entrie.isVideo()) {
              carouselData.push({ type: 'video', source: entrie.videoPoster, uid: entrie.uid });
            } else if (entrie.isAudio) {
              carouselData.push({ type: 'audio', source: entrie.thumbnailUrl, uid: entrie.uid });
            } else if (entrie.isPicture()) {
              carouselData.push({ type: 'img', source: entrie.thumbnailUrl, uid: entrie.uid });
            } else if (entrie.isPdf()) {
              carouselData.push({ type: 'pdf', source: entrie.thumbnailUrl, uid: entrie.uid });
            }
          }
        });
        this.relatedDocs = carouselData;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }
}
