import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-creative-project-import-asset',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-import-asset.component.html',
})
export class DocumentCreativeProjectImportAssetComponent {

  assetType: string = 'Image';

  @Input() document: DocumentModel;

  changeAssetType(type: string): void {
    this.assetType = type;
  }

}
