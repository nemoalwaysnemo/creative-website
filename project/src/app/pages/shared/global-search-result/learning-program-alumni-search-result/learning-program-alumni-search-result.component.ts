import { Component, TemplateRef, Type } from '@angular/core';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';

@Component({
  selector: 'learning-program-alumni-search-result',
  styleUrls: ['./learning-program-alumni-search-result.component.scss'],
  templateUrl: './learning-program-alumni-search-result.component.html',
})
export class LearningProgramAlumniSearchResultComponent {

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) { }

  dialogMetadata: any = {
  };

  getDialogSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<any>[] = [];
    switch (type) {
      case 'backslash':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_BACKSLASH_ASSET);
        break;
      default:
        break;
    }
    return new GlobalDocumentDialogSettings({ components });
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

}
