import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subject, timer, Subscription } from 'rxjs';

@Component({
  selector: 'creative-asset-template-tabs',
  styleUrls: ['./creative-asset-template-tabs.scss'],
  templateUrl: './creative-asset-template-tabs.component.html',
})
export class CreativeAssetTemplateTabsComponent {

  @Input() documentModel: DocumentModel;

}
