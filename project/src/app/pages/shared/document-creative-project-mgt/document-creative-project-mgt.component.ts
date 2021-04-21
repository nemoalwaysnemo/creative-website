import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentPageService } from '../services/document-page.service';
import { CreativeProjectMgtBaseComponent } from './document-creative-project-mgt-base.component';

@Component({
  selector: 'document-creative-project-mgt-page',
  styleUrls: ['./document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-mgt.component.html',
})
export class CreativeProjectMgtComponent extends CreativeProjectMgtBaseComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  protected onInit(): void {
    console.log(33333);
  }

}
