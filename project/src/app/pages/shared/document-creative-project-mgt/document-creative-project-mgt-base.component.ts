import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { of as observableOf, Observable, Subject, combineLatest } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';
import { CreativeProjectMgtBaseTemplateComponent } from './document-creative-project-mgt-base-template.component';

@Component({
  template: '',
})
export class CreativeProjectMgtBaseComponent extends CreativeProjectMgtBaseTemplateComponent {

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

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
    }
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

}
