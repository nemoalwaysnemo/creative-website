import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentPageService } from '../services/document-page.service';
import { BaseSearchFormComponent } from './base-search-form.component';
import { GlobalSearchFormService } from './global-search-form.service';

@Component({
  selector: 'global-search-form',
  styleUrls: ['./global-search-form.component.scss'],
  templateUrl: './global-search-form.component.html',
})
export class GlobalSearchFormComponent extends BaseSearchFormComponent {

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      documentPageService,
      globalSearchFormService,
    );
  }

}
