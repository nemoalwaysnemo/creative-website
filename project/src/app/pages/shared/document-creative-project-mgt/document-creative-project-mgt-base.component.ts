import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { NbMenuItem } from '@core/nebular/theme';
import { of as observableOf, Observable, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { DocumentCreativeProjectMgtBasePageComponent } from './document-creative-project-mgt-base-page.component';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  template: '',
})
export class DocumentCreativeProjectMgtBaseComponent extends DocumentCreativeProjectMgtBasePageComponent {

  actions$: Subject<NbMenuItem[]> = new BehaviorSubject<NbMenuItem[]>([]);

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setInputDocument(doc);
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
    protected globalDocumentDialogService: GlobalDocumentDialogService) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.onDocumentChanged();
  }

  protected setInputDocument(doc: DocumentModel): void {
    if (doc) {
      this.document$.next(doc);
    }
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, settings: CreativeProjectMgtSettings): Observable<DocumentModel> {
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
      this.prepareDocument(doc, user, settings);
      this.setDocument(doc, user, settings);
      this.performDocument(doc, user, settings);
    });
    this.subscription.add(subscription);
  }

  protected setDocument(doc: DocumentModel, user: UserModel, settings: CreativeProjectMgtSettings): void {
    this.templateSettings = settings;
    this.currentUser = user;
    this.document = doc;
  }

  protected performDocument(doc: DocumentModel, user: UserModel, settings: CreativeProjectMgtSettings): void {

  }

  protected prepareDocument(doc: DocumentModel, user: UserModel, settings: CreativeProjectMgtSettings): void {
    if (doc) {
      const brand = doc.filterParents(['App-Library-Folder']).pop();
      if (brand) {
        doc.setParent(brand, 'brand');
      }
      const campaignMgt = doc.filterParents(['App-Library-Campaign-Mgt-Folder']).pop();
      if (campaignMgt) {
        doc.setParent(campaignMgt, 'parent');
      }
    }
  }

}
