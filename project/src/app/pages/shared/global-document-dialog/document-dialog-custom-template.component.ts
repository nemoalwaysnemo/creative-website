import { Component, Type } from '@angular/core';
import { DocumentPageService } from '../services/document-page.service';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentDialogBaseTemplateComponent } from './document-dialog-base-template.component';

@Component({
  template: '',
})
export class DocumentDialogCustomTemplateComponent extends DocumentDialogBaseTemplateComponent {

  static readonly COMPONENT_TYPE: string = 'custom';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  backToMainView(componentName: string = null, component: Type<any> = null, metadata?: any): void {
    const m = this.mainViewChanged;
    const settings = metadata || (m.metadata || []).pop();
    if (this.getExcludeHomeViews().includes(settings.homeView)) {
      settings.mainViewChanged = false;
    }
    this.globalDocumentDialogService.backToMainView(componentName || m.componentName, settings || this.getDialogSettings(), component || m.component);
  }

  protected subscribeDialogEvents(): void {
    this.subscribeDialogBuiltInEvents();
  }

  protected getExcludeHomeViews(): string[] {
    return [];
  }
}
