import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { of as observableOf, Observable, Subject, combineLatest } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';
import { DocumentCreativeProjectMgtBasePageComponent } from './document-creative-project-mgt-base-page.component';

@Component({
  template: '',
})
export class DocumentCreativeProjectMgtBaseComponent extends DocumentCreativeProjectMgtBasePageComponent {

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: any) {
    this.templateSettings$.next(settings);
  }

  protected templateSettings$: Subject<CreativeProjectMgtSettings> = new Subject<CreativeProjectMgtSettings>();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
    this.onDocumentChanged();
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentPageService.getCurrentUser(),
      this.templateSettings$,
    ]).pipe(
      concatMap(([doc, user, settings]: [DocumentModel, UserModel, CreativeProjectMgtSettings]) => combineLatest([
        this.beforeSetDocument(doc, user, settings),
        observableOf(user),
        observableOf(settings),
      ])),
    ).subscribe(([doc, user, settings]: [DocumentModel, UserModel, CreativeProjectMgtSettings]) => {
      this.templateSettings = settings;
      this.currentUser = user;
      this.document = doc;
    });
    this.subscription.add(subscription);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      const brand = doc.filterParents(['App-Library-Folder']).pop();
      if (brand) {
        doc.setParent(brand, 'brand');
      }
      const campaignMgt = doc.filterParents(['App-Library-Campaign-Mgt-Folder']).pop();
      if (campaignMgt) {
        doc.setParent(campaignMgt, 'parent');
      }
      this.document = doc;
    }
  }

}
