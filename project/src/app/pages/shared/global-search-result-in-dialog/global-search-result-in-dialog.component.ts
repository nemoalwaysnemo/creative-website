import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentPageService } from '../services/document-page.service';
import { SelectableItemSettings } from '../document-selectable';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { BaseGlobalSearchResultComponent } from '../global-search-result/base-global-search-result.component';

@Component({
  selector: 'global-search-result-in-dialog',
  styleUrls: ['../global-search-result/global-search-result.component.scss'],
  templateUrl: '../global-search-result/global-search-result.component.html',
})
export class GlobalSearchResultInDialogComponent extends BaseGlobalSearchResultComponent {

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
