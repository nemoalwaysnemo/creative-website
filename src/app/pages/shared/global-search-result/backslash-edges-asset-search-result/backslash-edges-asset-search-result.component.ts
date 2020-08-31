import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { SelectableItemSettings } from '../../../shared/selectable-item/selectable-item.interface';

@Component({
  selector: 'backslash-edges-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-edges-asset-search-result.component.html',
})
export class BackslashEdgesAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  @Input() selectableSettings: SelectableItemSettings = new SelectableItemSettings({
    enableSelectable: false,
  });

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
