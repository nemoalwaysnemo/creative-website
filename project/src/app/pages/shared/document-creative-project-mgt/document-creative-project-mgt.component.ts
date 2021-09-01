import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectMgtBasePageComponent } from './document-creative-project-mgt-base-page.component';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { TAB_CONFIG } from './document-creative-project-mgt-tab-config';
import { DocumentModel, NuxeoSearchConstants, UserModel } from '@core/api';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';
import { of as observableOf, Observable, Subject, combineLatest } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-creative-project-mgt-page',
  styleUrls: ['./document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-mgt.component.html',
})
export class DocumentCreativeProjectMgtComponent extends DocumentCreativeProjectMgtBasePageComponent {

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

  protected templateSettings$: Subject<CreativeProjectMgtSettings> = new Subject<CreativeProjectMgtSettings>();

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

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, settings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_PROJECT_TYPE,
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
      ecm_uuid: `["${doc.get('The_Loupe_Main:jobtitle').join('", "')}"]`,
      currentPageIndex: 0,
      ecm_fulltext: '',
      pageSize: 1,
    };
    return settings.documentType === 'asset' && !doc.hasParent('project') ? this.search(params).pipe(
      map((d: DocumentModel[]) => doc.setParent(d.shift(), 'project')),
    ) : observableOf(doc);
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
      this.setDocument(doc, user, settings);
      this.performDocument(doc, user, settings);
      this.loading = false;
    });
    this.subscription.add(subscription);
  }

  protected setDocument(doc: DocumentModel, user: UserModel, settings: CreativeProjectMgtSettings): void {
    this.templateSettings = settings;
    this.currentUser = user;
    this.document = doc;
  }

  protected performDocument(doc: DocumentModel, user: UserModel, settings: CreativeProjectMgtSettings): void {
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
