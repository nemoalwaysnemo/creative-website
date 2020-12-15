import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'disruption-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-document-asset-search-result.component.html',
})
export class DisruptionDocumentAssetSearchResultComponent {

  private assetUrlMapping: any = {
    'App-Disruption-Day': '/p/disruption/Disruption Days/day',
    '*': '/p/disruption/asset',
  };

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

}
