import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '@pages/shared';

@Component({
  selector: 'intelligence-folder-view',
  styleUrls: ['./intelligence-folder-view.component.scss'],
  templateUrl: './intelligence-folder-view.component.html',
})
export class IntelligenceFolderViewComponent {

  showBackButton: boolean = false;

  documentModel: DocumentModel;

  @Input() loading: boolean;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.showBackButton = !this.folderType.includes(doc.type);
    }
  }

  private folderType: string[] = ['App-Intelligence-Consumer-Folder', 'App-Intelligence-Industry-Folder', 'App-Intelligence-Marketing-Folder', 'App-Intelligence-Brands-Folder'];

  constructor(private documentPageService: DocumentPageService) {

  }

  toSelfUrl(): string {
    return `/p/intelligence/folder/${this.documentModel.uid}`;
  }

  backToParent(): void {
    this.documentPageService.redirect(`/p/intelligence/folder/${this.documentModel.parentRef}`);
  }

}
