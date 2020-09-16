import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { PictureGallerySettings } from '../picture-gallery/picture-gallery.interface';

@Component({
  selector: 'document-featured-carousel',
  styleUrls: ['./document-featured-carousel.component.scss'],
  templateUrl: './document-featured-carousel.component.html',
})
export class DocumentFeaturedCarouselComponent implements OnInit, OnDestroy {

  @Input() gallerySettings: PictureGallerySettings = new PictureGallerySettings();

  @Input() infoTemplate: TemplateRef<any>;

  @Input() galleryItems: any[] = [];

  galleryEvent: string = 'play';

  status: string = 'closed';

  showInfo: boolean = false;

  selectedDocument: DocumentModel;

  private playStatus: boolean = false;

  constructor(private documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  onPlayingChange(e: any): void {
    this.playStatus = (e && e.isPlaying === true) ? false : true;
    this.showInfo = this.showInfo && this.playStatus;
    this.onStatusChanged();
    this.toggleStatus();
  }

  onStatusChanged(): void {
    this.galleryEvent = this.showInfo === true ? 'stop' : 'play';
  }

  toggleStatus(): void {
    this.status = this.showInfo === true ? 'opened' : 'closed';
  }

  toggleInfo(doc: DocumentModel): void {
    this.showInfo = !this.showInfo;
    this.selectedDocument = doc;
    this.onStatusChanged();
    this.toggleStatus();
    if (this.showInfo) {
      this.documentPageService.googleAnalyticsTrackEvent({
        event_category: 'Gallery',
        event_action: `Gallery Item Preview`,
        event_label: `Gallery Item Preview - ${doc.title}`,
        event_value: doc.uid,
        'dimensions.docId': doc.uid,
        'dimensions.docTitle': doc.title,
      });
    }
  }

}
