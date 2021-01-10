import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { NuxeoPagination, DocumentModel, NuxeoPermission } from '@core/api';
import { vocabularyFormatter } from '@core/services/helpers';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';
import { GlobalDocumentDialogSettings } from '@pages/shared/global-document-dialog';
import { DocumentPageService, PictureGallerySettings, GlobalDocumentDialogService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-roadmaps-gallery',
  styleUrls: ['./disruption-roadmaps-gallery.component.scss'],
  templateUrl: './disruption-roadmaps-gallery.component.html',
})
export class DisruptionRoadmapsGalleryComponent implements OnInit, OnDestroy {

  editTitle: string = 'Edit';

  galleryItems: any[] = [];

  editRedirectUrl: string = this.documentPageService.getCurrentUrl();

  writePermission$: Observable<boolean> = observableOf(false);

  downloadPermission$: Observable<boolean> = observableOf(true);

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM] });

  dialogMetadata: any = {
    formMode: 'edit',
  };

  gallerySettings: PictureGallerySettings = new PictureGallerySettings({
    enableTitle: false,
  });

  private params: any = {
    currentPageIndex: 0,
    pageSize: 5,
    ecm_fulltext: '',
    app_edges_featured_asset: true,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_ROADMAPS_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_ROADMAP_TYPE,
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.documentPageService.advanceRequest(this.params).subscribe((res: NuxeoPagination) => {
      this.galleryItems = this.convertItems(res.entries);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

  hasPermission(doc: DocumentModel, name: string): Observable<boolean> {
    switch (name) {
      case 'write':
        return doc.hasPermission(NuxeoPermission.Write);
      default:
        return observableOf(false);
    }
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }

  private convertItems(entiries: DocumentModel[]): any[] {
    const items: any[] = [];
    for (const doc of entiries) {
      if (doc.isVideo() && doc.hasVideoContent()) {
        items.push({ src: doc.getCarouselVideoSources(), thumb: doc.thumbnailUrl, poster: doc.videoPoster, title: doc.title, uid: doc.uid, docType: doc.type, description: doc.get('dc:description'), doc });
      } else if (doc.isPicture() || doc.isPdf()) {
        items.push({ src: doc.fullHDPicture, thumb: doc.thumbnailUrl, title: doc.title, uid: doc.uid, docType: doc.type, description: doc.get('dc:description'), doc });
      }
    }
    return items;
  }

}
