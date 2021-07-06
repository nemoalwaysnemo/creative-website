import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { getDocumentTypes, vocabularyFormatter } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { GLOBAL_DOCUMENT_FORM } from '../../../global-document-form';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-asset-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './disruption-asset-preview-dialog.component.scss'],
  templateUrl: './disruption-asset-preview-dialog.component.html',
})
export class DisruptionAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'disruption-asset-preview';

  attachments: { type: string, url: string, title: string }[] = [];

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  viewerSettings: any = {
    layout: this.getDialogSettings().docViewerLayout,
  };

  hideDialogInfo: boolean = false;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    this.documentPageService.onEventType('knowledge-inner-dialog').subscribe((e: GlobalEvent) => {
      if (e.name === 'Opened') {
        this.hideDialogInfo = true;
      } else {
        this.hideDialogInfo = false;
      }
    });
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.attachments = this.document.getAttachmentList();
      this.writePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Write, this.getDialogSettings().enableEdit);
      this.deletePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Delete, this.getDialogSettings().enableDeletion);
      this.shareUrl = this.buildShareUrl(doc);
    }
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: false,
      enableEdit: false,
      enablePreview: false,
      enableDeletion: false,
      enableDetail: false,
      enableKnowledgeRelated: false,
    };
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }

  getDialogFormTemplateName(doc: DocumentModel): string {
    let name: string = '';
    if (doc.type === 'App-Disruption-Roadmap-Asset') {
      name = GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM.NAME;
    } else if (doc.type === 'App-Disruption-Theory-Asset') {
      name = GLOBAL_DOCUMENT_FORM.DISRUPTION_HOW_TOS_ASSET_FORM.NAME;
    } else if (doc.type === 'App-Disruption-Asset') {
      name = GLOBAL_DOCUMENT_FORM.DISRUPTION_BRILLIANT_THINKING_FORM.NAME;
    }
    return name;
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  isDisruptionRoadmapAsset(doc: DocumentModel): boolean {
    return this.isDisruptionAsset(doc) && getDocumentTypes(NUXEO_DOC_TYPE.DISRUPTION_ROADMAP_TYPE).includes(doc.type);
  }

  private buildShareUrl(doc: DocumentModel): string {
    if (this.isIntelligenceAsset(doc)) {
      return this.documentPageService.getCurrentAppUrl('intelligence/asset/' + doc.uid);
    } else if (this.isDisruptionAsset(doc)) {
      let url: string;
      if (doc.path.includes(NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH)) {
        url = 'disruption/Disruption Days/day/:parentRef/asset/';
      } else if (doc.path.includes(NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH)) {
        url = 'disruption/Disruption How Tos/folder/:parentRef/asset/';
      } else {
        url = 'disruption/asset/';
      }
      return this.documentPageService.getCurrentAppUrl(url.replace(':parentRef', doc.parentRef) + doc.uid);
    }
    return this.shareUrl;
  }
}
