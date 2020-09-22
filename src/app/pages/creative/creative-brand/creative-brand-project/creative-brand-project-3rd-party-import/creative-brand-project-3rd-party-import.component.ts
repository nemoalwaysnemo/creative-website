import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, SearchFilterModel, NuxeoSearchConstants, GlobalSearchParams, NuxeoRequestOptions } from '@core/api';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SelectableItemSettings, GlobalSearchSettings} from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { SelectableItemService } from '../../../../shared/selectable-item/selectable-item.service';
@Component({
  selector: 'creative-brand-project-3rd-party-import',
  templateUrl: './creative-brand-project-3rd-party-import.component.html',
  styleUrls: ['../../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandProject3rdPartyImportComponent extends GlobalDocumentViewComponent {
  baseParams$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_asset full-width';

  showcase: string = 'add';

  target: DocumentModel;
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    // if (doc) {
    //   console.info(doc);
    //   if (doc) {
    //     this.getTargetDocumentModel({
    //       pageSize: 1,
    //       currentPageIndex: 0,
    //       ecm_uuid: this.activatedRoute.snapshot.paramMap.get('project'),
    //       ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_PROJECT_TYPE,
    //     }).subscribe((target: DocumentModel) => {
    //       this.target = target;
    //       console.info(this.target);
    //       this.target.setParent(doc);
    //     });
    //   }
    // }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_uuid: this.activatedRoute.snapshot.paramMap.get('request'),
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMPORT_REQUEST_TYPE,
    };
  }

  protected getCurrentDocumentRequestParams(): NuxeoRequestOptions {
    const options = new NuxeoRequestOptions();
    options.addSchemas('The_Loupe_Delivery');
    return options;
  }
}
