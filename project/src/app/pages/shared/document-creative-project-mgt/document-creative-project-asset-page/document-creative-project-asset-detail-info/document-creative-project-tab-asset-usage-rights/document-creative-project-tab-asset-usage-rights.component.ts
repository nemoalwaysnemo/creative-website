import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentCreativeProjectMgtBaseComponent } from '../../../document-creative-project-mgt-base.component';
import { DocumentPageService } from '../../../../services/document-page.service';

@Component({
  selector: 'document-creative-project-tab-asset-usage-rights',
  styleUrls: ['../../../document-creative-project-mgt.component.scss', '../../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-tab-asset-usage-rights.component.html',
})
export class DocumentCreativeProjectTabAssetUsageRightsComponent extends DocumentCreativeProjectMgtBaseComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
    }
  }
}
