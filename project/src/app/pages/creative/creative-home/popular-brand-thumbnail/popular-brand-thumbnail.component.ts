import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentPageService } from '../../../shared';
import { Subscription } from 'rxjs';
import { NuxeoPagination, DocumentModel, GlobalSearchParams } from '@core/api';
import { DocumentThumbnailViewSettings } from '../../../shared/document-thumbnail-view';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-popular-brand-thumbnail',
  styleUrls: ['./popular-brand-thumbnail.component.scss'],
  templateUrl: './popular-brand-thumbnail.component.html',
})
export class PopularBrandThumbnailComponent implements OnInit, OnDestroy {

  loading: boolean = true;

  documents: DocumentModel[];

  thumbnailViewSettings: DocumentThumbnailViewSettings = new DocumentThumbnailViewSettings({
    layout: 'full-width popular_brand',
  });

  private subscription: Subscription = new Subscription();

  private params: GlobalSearchParams = new GlobalSearchParams({
    pageSize: 3,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_SELECTED_BRAND_TYPE,
  });

  constructor(private documentPageService: DocumentPageService) { }

  ngOnInit(): void {
    this.subscription = this.documentPageService.advanceRequest(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
