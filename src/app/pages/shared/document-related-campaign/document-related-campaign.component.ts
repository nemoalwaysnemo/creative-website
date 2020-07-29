
import { Component, Input, ViewChild, OnDestroy } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { DocumentModel, NuxeoSearchParams, NuxeoPagination } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { Subscription } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-related-campaign',
  styleUrls: ['./document-related-campaign.component.scss'],
  templateUrl: './document-related-campaign.component.html',
})
export class DocumentRelatedCampaignComponent implements OnDestroy {

  loading: boolean = true;

  relatedDocs: { type: any, source: any, uid: any }[] = [];

  private subscription: Subscription = new Subscription();

  @Input() styleName: string;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.loading = true;
      this.searchRelatedCampaign(doc);
    }
  }

  @ViewChild('nav', { static: true, read: DragScrollComponent }) ds: DragScrollComponent;

  constructor(private documentPageService: DocumentPageService) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDocumentType(): string {
    return this.document ? this.document.type.toLowerCase() : '';
  }

  redirectToDoc(doc: DocumentModel): void {
    this.documentPageService.redirect(`/p/creative/asset/${doc.uid}`);
  }

  private searchRelatedCampaign(doc: DocumentModel): void {
    const campaign = doc.get('The_Loupe_Main:campaign');
    if (campaign == null) {
      this.loading = false;
      this.relatedDocs = [];
    } else {
      const params: any = {
        ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
        ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
        the_loupe_main_campaign: `["${campaign}"]`,
        ecm_uuid_not_eq: doc.uid,
        currentPageIndex: 0,
        pageSize: 25,
      };
      const subscription = this.documentPageService.advanceRequest(new NuxeoSearchParams(params))
        .subscribe((res: NuxeoPagination) => {
          this.relatedDocs = this.wrapAsCarouselData(res.entries);
          this.loading = false;
        });
      this.subscription.add(subscription);
    }
  }

  private wrapAsCarouselData(entries: DocumentModel[]): any[] {
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

  moveLeft(): void {
    this.ds.moveLeft();
  }

  moveRight(): void {
    this.ds.moveRight();
  }

}
