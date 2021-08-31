import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { of as observableOf, Observable, Subject, combineLatest } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CreativeCampaignMgtSettings } from './document-creative-campaign-mgt.interface';
import { DocumentCreativeCampaignMgtBasePageComponent } from './document-creative-campaign-mgt-base-page.component';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
@Component({
  template: '',
})
export class DocumentCreativeCampaignMgtBaseComponent extends DocumentCreativeCampaignMgtBasePageComponent {

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setDocument(doc);
  }

  @Input()
  set settings(settings: any) {
    this.templateSettings$.next(settings);
  }

  protected templateSettings$: Subject<CreativeCampaignMgtSettings> = new Subject<CreativeCampaignMgtSettings>();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();
  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.onDocumentChanged();
  }
  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeCampaignMgtSettings): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentPageService.getCurrentUser(),
      this.templateSettings$,
    ]).pipe(
      concatMap(([doc, user, settings]: [DocumentModel, UserModel, CreativeCampaignMgtSettings]) => combineLatest([
        this.beforeSetDocument(doc, user, settings),
        observableOf(user),
        observableOf(settings),
      ])),
    ).subscribe(([doc, user, settings]: [DocumentModel, UserModel, CreativeCampaignMgtSettings]) => {
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
      this.document$.next(doc);
    }
  }

}
