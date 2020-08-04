import { Component, OnInit, OnDestroy } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams } from '@core/api';
import { DocumentPageService, PictureGallerySettings } from '@pages/shared';
import { Subscription } from 'rxjs';
import { filter, map, concatMap } from 'rxjs/operators';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-home-gallery',
  styleUrls: ['./disruption-home-gallery.component.scss'],
  templateUrl: './disruption-home-gallery.component.html',
})
export class DisruptionHomeGalleryComponent implements OnInit, OnDestroy {

  galleryItems: any[] = [];

  gallerySettings: PictureGallerySettings = new PictureGallerySettings({
    enableOuterLink: true,
    enableTitle: true,
  });

  private params: any = {
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_AWARD_ASSET_TYPE,
  };

  private gallerySwitch: any = {
    pageSize: 1,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_AWARD_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_AWARD_FOLDER_TYPE,
  };

  showGallery: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {
    this.getItems();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getItems(): void {
    this.subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(this.gallerySwitch)).pipe(
      map((res: NuxeoPagination) => {
        this.showGallery = res.entries.length > 0 && (res.entries[0].get('app_global:enable_carousel') === true);
        return this.showGallery;
      }),
      filter((show: boolean) => show),
      concatMap(_ => this.documentPageService.advanceRequest(this.params)),
    ).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.convertItems(res.entries);
    });
  }

  private convertItems(entiries: DocumentModel[]): any[] {
    const items = new Array();
    for (const doc of entiries) {
      if (doc.isVideo() && doc.hasVideoContent()) {
        items.push({ src: doc.getCarouselVideoSources(), thumb: doc.attachedImage, poster: doc.attachedImage, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), link: this.getUrl(doc.get('app_Edges:URL')) });
      } else if (doc.isPicture()) {
        const url = doc.attachedImage;
        items.push({ src: url, thumb: url, title: doc.title, uid: doc.uid, description: doc.get('dc:description'), link: this.getUrl(doc.get('app_Edges:URL')) });
      }
    }
    return items;
  }

  getUrl(url: string): string {
    if (url && url.length > 0) {
      return 'https://' + url.match(/(http:\/\/)?([A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*)/g)[0];
    } else {
      return '';
    }
  }

}
