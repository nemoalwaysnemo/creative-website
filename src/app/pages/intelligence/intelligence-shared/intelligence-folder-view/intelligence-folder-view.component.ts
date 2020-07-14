import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '@pages/shared';

@Component({
  selector: 'intelligence-folder-view',
  styleUrls: ['./intelligence-folder-view.component.scss'],
  templateUrl: './intelligence-folder-view.component.html',
})
export class IntelligenceFolderViewComponent {

  isShow: boolean = false;

  documentModel: DocumentModel;

  @Input() loading: boolean;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.isShow = this.showBackToParent(doc.type);
    }
  }

  private folderType: string[] = ['App-Intelligence-Consumer-Folder', 'App-Intelligence-Industry-Folder', 'App-Intelligence-Marketing-Folder', 'App-Intelligence-Brands-Folder'];

  constructor(private documentPageService: DocumentPageService) {

  }

  backToParent(): void {
    this.documentPageService.redirect(`/p/intelligence/folder/${this.documentModel.parentRef}`);
  }

  private showBackToParent(type: string): boolean {
    return !this.folderType.includes(type);
  }

}
