import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentPageService } from '../services/document-page.service';
import { SelectableItemSettings } from '../document-selectable';
import { BaseGlobalSearchResultComponent } from './base-global-search-result.component';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';

@Component({
  selector: 'global-search-result',
  styleUrls: ['./global-search-result.component.scss'],
  templateUrl: './global-search-result.component.html',
})
export class GlobalSearchResultComponent extends BaseGlobalSearchResultComponent {

  @Input() templateRef: TemplateRef<any>;

  @Input() hasPagination: boolean = true;

  @Input() hideEmpty: boolean = false;

  @Input() layout: string = 'disruption-home';

  @Input() loadingStyle: any = { 'min-height': '120px' };

  @Input() selectableSettings: SelectableItemSettings;

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(documentPageService, globalSearchFormService);
  }

}
