import { Component, Input, TemplateRef } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { SelectableItemSettings } from '../selectable-item/selectable-item.interface';
import { AbstractGlobalSearchResultComponent } from './abstract-global-search-result.component';

@Component({
  selector: 'global-search-result',
  styleUrls: ['./global-search-result.component.scss'],
  templateUrl: './global-search-result.component.html',
})
export class GlobalSearchResultComponent extends AbstractGlobalSearchResultComponent {

  @Input() templateRef: TemplateRef<any>;

  @Input() hasPagination: boolean = true;

  @Input() layout: string = 'disruption-home';

  @Input() hideEmpty: boolean = false;

  @Input() selectableSettings: SelectableItemSettings;

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

}
