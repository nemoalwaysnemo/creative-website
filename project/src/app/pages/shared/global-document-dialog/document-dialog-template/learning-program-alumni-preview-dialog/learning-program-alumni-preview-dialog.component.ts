import { Component } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoPagination, NuxeoRequestOptions } from '@core/api';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'learning-program-alumni-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './learning-program-alumni-preview-dialog.component.scss'],
  templateUrl: './learning-program-alumni-preview-dialog.component.html',
})
export class LearningProgramAlumniPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'learning-program-alumni-preview';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.getRemoteUserInfo(doc);
    }
  }

  getFacebookUrl(doc: DocumentModel, width: number): string {
    const url = doc.get('remote-search-collective-user:facebook_photo_url');
    if (url) {
      return url + '&width=' + width;
    } else {
      return '/assets/images/no-thumbnail.png';
    }
  }

  private getRemoteUserInfo(doc: DocumentModel): void {
    const params: any = {
      queryParams: [doc.get('remote-search-collective-user:email')],
      extractorName: 'collective-user-info',
      currentPageIndex: 0,
      pageSize: 1,
    };
    const options = new NuxeoRequestOptions().setOptions('schemas', ['dublincore', 'remote-search-collective-user']);
    const subscription = this.documentPageService.operation(NuxeoAutomations.TBWARemoteSearch, params, null, options).subscribe((res: NuxeoPagination) => {
      this.document = res.entries.shift();
    });
    this.subscription.add(subscription);
  }

  getNominationPairs(programs: any[]): any[] {
    return (programs || []).map((x: any) => {
      const l = x.split(' - ');
      return { name: l[0], year: l[1] };
    });
  }
}
