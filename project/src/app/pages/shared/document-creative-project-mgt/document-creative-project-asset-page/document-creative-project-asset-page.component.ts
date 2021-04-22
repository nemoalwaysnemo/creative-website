import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { DocumentCreativeProjectMgtBasePageComponent } from '../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProjectAssetHomeComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';

@Component({
  selector: 'document-creative-project-asset-page',
  styleUrls: ['../document-creative-project-mgt.component.scss', './document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-page.component.html',
})
export class DocumentCreativeProjectAssetPageComponent extends DocumentCreativeProjectMgtBasePageComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  protected onInit(): void {
    this.changeView(DocumentCreativeProjectAssetHomeComponent);
  }

  protected onViewChanged(event: GlobalEvent): void {

  }
}
