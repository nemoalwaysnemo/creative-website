import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeCampaignMgtBasePageComponent } from './document-creative-campaign-mgt-base-page.component';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { TAB_CONFIG } from './document-creative-campaign-mgt-tab-config';
import { DocumentModel, UserModel } from '@core/api';
import { CreativeCampaignMgtSettings } from './document-creative-campaign-mgt.interface';
import { of as observableOf, Observable, Subject, combineLatest } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'document-creative-campaign-mgt-page',
  styleUrls: ['./document-creative-campaign-mgt.component.scss'],
  templateUrl: './document-creative-campaign-mgt.component.html',
})
export class DocumentCreativeCampaignMgtComponent extends DocumentCreativeCampaignMgtBasePageComponent {


  loading: boolean = true;

  tabs: NbMenuItem[] = TAB_CONFIG;

  @Input()
  set documentModel(doc: DocumentModel) {
    this.document$.next(doc);
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
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.onDocumentChanged();
    this.subscribeEvents();
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, settings: CreativeCampaignMgtSettings): Observable<DocumentModel> {
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
      this.setDocument(doc, user, settings);
      this.performDocument(doc, user, settings);
      this.loading = false;
    });
    this.subscription.add(subscription);
  }

  protected setDocument(doc: DocumentModel, user: UserModel, settings: CreativeCampaignMgtSettings): void {
    this.templateSettings = settings;
    this.currentUser = user;
    this.document = doc;
  }

  protected performDocument(doc: DocumentModel, user: UserModel, settings: CreativeCampaignMgtSettings): void {
    const page = this.getAssetPageConfig(this.templateSettings.homePage) || this.getDefaultPageConfig();
    if (page) {
      this.changeView(page.component, this.templateSettings);
    }
  }

  private getDefaultPageConfig(): NbMenuItem {
    return this.tabs.find((t: NbMenuItem) => t.selected);
  }

  private getAssetPageConfig(name: string): any {
    return this.tabs.find((t: NbMenuItem) => t.id === name);
  }

  protected onPageChanged(event: GlobalEvent): void {
    if (event.data.component) {
      this.changeView(event.data.component, event.data.settings);
    }
  }

}
