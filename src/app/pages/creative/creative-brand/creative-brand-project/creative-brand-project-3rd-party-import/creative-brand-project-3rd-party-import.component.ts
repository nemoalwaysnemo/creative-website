import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, SearchFilterModel, NuxeoSearchConstants } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-project-3rd-party-import',
  templateUrl: './creative-brand-project-3rd-party-import.component.html',
  styleUrls: ['../../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandProject3rdPartyImportComponent extends GlobalDocumentViewComponent {


}
