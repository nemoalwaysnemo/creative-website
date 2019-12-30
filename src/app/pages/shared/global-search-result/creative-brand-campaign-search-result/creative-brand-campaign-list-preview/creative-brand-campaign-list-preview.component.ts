import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
@Component({
  selector: 'creative-brand-campaign-list-preview',
  styleUrls: ['./creative-brand-campaign-list-preview.component.scss'],
  templateUrl: './creative-brand-campaign-list-preview.component.html',
})
export class CreativeBrandCampaignListPreviewComponent {
  doc: DocumentModel;

  @Input()
  set document(doc: DocumentModel) {
    this.doc = doc;
  }

}
