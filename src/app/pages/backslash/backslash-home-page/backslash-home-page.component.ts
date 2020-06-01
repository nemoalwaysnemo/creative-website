import { Component } from '@angular/core';
import { DocumentPageService } from '@pages/shared';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';

@Component({
  selector: 'backslash-home-page',
  styleUrls: ['./backslash-home-page.component.scss'],
  templateUrl: './backslash-home-page.component.html',
})
export class BackslashHomePageComponent extends BaseDocumentViewComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }
}
