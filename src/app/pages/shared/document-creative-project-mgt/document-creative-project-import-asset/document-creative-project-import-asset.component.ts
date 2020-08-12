import { Component, Input } from '@angular/core';
import { GlobalDocumentFormComponent } from '../../global-document-form/global-document-form.component';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel } from '@core/custom';
import { DocumentPageService } from '../../services/document-page.service';
import { Observable } from 'rxjs';
import { UserModel, DocumentModel } from '@core/api';
import { SuggestionSettings } from '../../directory-suggestion/directory-suggestion-settings';
import { OptionModel } from '../../option-select/option-select.interface';
@Component({
  selector: 'document-creative-project-import-asset',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-import-asset.component.html',
})
export class DocumentCreativeProjectImportAssetComponent {

  @Input() assetType: string;

  loading: boolean = false;

  doc: DocumentModel;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      // this.loading = false;
    }
  }
}

