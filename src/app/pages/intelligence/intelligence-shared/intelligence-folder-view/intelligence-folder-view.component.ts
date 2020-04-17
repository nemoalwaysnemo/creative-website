import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'intelligence-folder-view',
  styleUrls: ['./intelligence-folder-view.component.scss'],
  templateUrl: './intelligence-folder-view.component.html',
})
export class IntelligenceFolderViewComponent {

  isShow: boolean = false;

  doc: DocumentModel;

  @Input() loading: boolean;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.isShow = this.showBackToParent(doc.type);
    }
  }

  private folderType: string[] = ['App-Intelligence-Consumer-Folder', 'App-Intelligence-Industry-Folder', 'App-Intelligence-Marketing-Folder', 'App-Intelligence-Brands-Folder'];

  constructor(private router: Router) {

  }

  backToParent(): void {
    this.router.navigate(['p/redirect'], { queryParams: { url: `/p/intelligence/folder/${this.doc.parentRef}` } });
  }

  private showBackToParent(type: string): boolean {
    return !this.folderType.includes(type);
  }

}
