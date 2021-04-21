import { Component, Input, OnInit, OnDestroy, ComponentRef, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { of as observableOf, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { DocumentPageService } from '../services/document-page.service';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';

@Component({
  template: '',
})
export class CreativeProjectMgtBaseComponent implements OnInit, OnDestroy {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  document: DocumentModel;

  currentUser: UserModel;

  templateSettings: CreativeProjectMgtSettings = new CreativeProjectMgtSettings();

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      console.log(44444, doc);
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: any) {
    this.templateSettings$.next(settings);
  }

  protected templateSettings$: Subject<CreativeProjectMgtSettings> = new Subject<CreativeProjectMgtSettings>();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  protected dynamicComponentRef: ComponentRef<any>;

  protected subscription: Subscription = new Subscription();

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    this.onDocumentChanged();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  protected onInit(): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
    this.clearDynamicComponent();
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
      console.log(1111111, doc, user, settings);
    });
    this.subscription.add(subscription);
  }

  private changeView(component: Type<any>, settings: any = {}): void {
    if (component) {
      this.clearDynamicComponent();
      this.buildComponent(this.dynamicTarget, component, settings);
    }
  }

  private clearDynamicComponent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = null;
    }
  }

  private createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  protected buildComponent(dynamicTarget: ViewContainerRef, component: Type<any>, settings: any = {}): void {
    this.dynamicComponentRef = this.createDynamicComponent(dynamicTarget, component);
    this.dynamicComponentRef.instance.documentModel = this.document;
    this.dynamicComponentRef.instance.templateSettings = settings;
  }


}
