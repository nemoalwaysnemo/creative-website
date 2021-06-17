import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-creative-campaign-info',
  styleUrls: ['../../document-creative-campaign-mgt.component.scss'],
  templateUrl: './document-creative-campaign-info.component.html',
})
export class DocumentCreativeCampaignInfoComponent {

  loading: boolean = true;

  doc: DocumentModel;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
    }
  }

  formatData(data: any): any[] {
    let datas = [];
    if (typeof (data) === 'string') {
      datas.push(data);
    } else {
      datas = datas.concat(data);
    }
    return Array.from(new Set(datas));
  }
}
