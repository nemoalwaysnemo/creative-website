import { Component, Input } from '@angular/core';
@Component({
  selector: 'tbwa-intelligence-industry-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './intelligence-industry-search-result.component.html',
})
export class IntelligenceIndustrySearchResultComponent {

  @Input() folderId: string;

}
