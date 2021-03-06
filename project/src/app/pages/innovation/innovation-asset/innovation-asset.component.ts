import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../innovation-tab-config';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'innovation-asset',
  styleUrls: ['./innovation-asset.component.scss'],
  templateUrl: './innovation-asset.component.html',
})
export class InnovationAssetComponent extends GlobalDocumentViewComponent implements OnInit {

  showFolderInfo: boolean = false;

  folder: DocumentModel;

  folderLoading: boolean = true;

  showButton: boolean = false;

  enableThumbnailCreation: boolean = true;

  deleteRedirectUrl: string = '';

  tabs: any[] = parseTabRoute(TAB_CONFIG);

  viewerSettings: any = {
  };

  folderParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path: this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH'),
    ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_FOLDER_TYPE,
    ecm_mixinType_not_in: '',
  };

  assetUrlMapping: any = {
    'App-Innovation-Folder': this.documentMap,
    'App-Innovation-Asset': this.documentMap,
    '*': '/p/innovation/asset',
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  ngOnInit(): void {
    this.onInit();
    this.searchFolder();
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_mixinType_not_in: '',
      ecm_path: this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE,
    };
  }

  private searchFolder(): void {
    const folderId = this.activatedRoute.snapshot.paramMap.get('folder');
    if (folderId) {
      this.getDocumentModel(folderId, this.folderParams).subscribe((res: NuxeoPagination) => {
        this.folderLoading = false;
        this.folder = res.entries.shift();
        this.deleteRedirectUrl = this.getDeleteRedirectUrl(this.folder);
      });
    } else {
      this.folderLoading = false;
    }
  }

  private getDeleteRedirectUrl(doc: DocumentModel): string {
    let url;
    if (doc.path === (this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'NEXT')) {
      url = '/p/innovation/NEXT';
    } else if (doc.path === (this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'Things to Steal')) {
      url = '/p/innovation/Things to Steal';
    } else if (doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_NEXT_FOLDER_PATH')) || doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_THINGS_TO_STEAL_FOLDER_PATH'))) {
      url = this.assetUrlMapping[doc.type].call(this, doc) + '/' + doc.uid;
    }
    return url;
  }

  documentMap(doc: DocumentModel): string {
    let url;
    if (doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'NEXT')) {
      url = '/p/innovation/NEXT/folder';
    } else if (doc.path.includes(this.documentPageService.getConfig('path:INNOVATION_BASE_FOLDER_PATH') + 'Things to Steal')) {
      url = '/p/innovation/Things to Steal/folder';
    }
    if (doc.type === 'App-Innovation-Asset') {
      url = url + '/:parentRef/asset';
    }
    return url;
  }
}
