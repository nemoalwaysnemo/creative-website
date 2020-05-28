import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearchService, NuxeoPageProviderParams } from '@core/api';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';
import { filter, map, concatMap } from 'rxjs/operators';

@Component({
  selector: 'disruption-home-gallery',
  styleUrls: ['./disruption-home-gallery.component.scss'],
  templateUrl: './disruption-home-gallery.component.html',
})
export class DisruptionHomeGalleryComponent implements OnInit, OnDestroy {

  galleryItems: any = [];

  gallerySettings: any = {
    playerInterval: 5000,
    autoPlay: true,
    dots: true,
    dotsSize: 10,
    loop: true,
    thumb: false,
  };

  private params: any = {
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_AWARD_ASSET_TYPE,
  };

  private gallerySwitch: any = {
    pageSize: 1,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_AWARD_FOLDER_TYPE,
  };

  showGallery: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private advanceSearchService: AdvanceSearchService) {
  }

  ngOnInit(): void {
    this.getItems();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getItems(): void {
    this.subscription = this.advanceSearchService.request(new NuxeoPageProviderParams(this.gallerySwitch)).pipe(
      map((res: NuxeoPagination) => {
        this.showGallery = res.entries.length > 0 && (res.entries[0].get('app_global:enable_carousel') === true);
        return this.showGallery;
      }),
      filter((show: boolean) => show),
      concatMap(_ => this.advanceSearchService.request(this.params)),
    ).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.convertItems(res.entries);
    });
  }

  private convertItems(entiries: DocumentModel[]): any[] {
    const imgArray = new Array();
    for (const entry of entiries) {
      if (entry.isVideo() && this.hasVideoContent(entry)) {
        imgArray.push({ src: entry.getCarouselVideoSources(), thumb: entry.attachedImage, poster: entry.attachedImage, title: entry.title, uid: entry.uid, description: entry.get('dc:description'), outerLink: this.getUrlContent(entry.get('app_Edges:URL')) });
      } else if (entry.isPicture()) {
        const url = entry.attachedImage;
        imgArray.push({ src: url, thumb: url, title: entry.title, uid: entry.uid, description: entry.get('dc:description'), outerLink: entry.get('app_Edges:URL') });
      } else {
      }
    }
    return imgArray;
  }

  hasVideoContent(entry: DocumentModel): boolean {
    return entry.getVideoSources().length > 0;
  }

  getUrlContent(url: string): string {
    if (url && url.length > 0) {
      return 'https://' + url.match(/(http:\/\/)?([A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*)/g)[0];
    } else {
      return '';
    }
  }

}
