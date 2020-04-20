import { Input, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { AbstractDocumentDialogComponent } from './abstract-document-dialog.component';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentModelForm } from '../abstract-classes/abstract-document-form.component';
import { SearchQueryParamsService } from '../../shared/services/search-query-params.service';
import { timer } from 'rxjs';

export abstract class AbstractDocumentFormDialogComponent extends AbstractDocumentDialogComponent implements DocumentModelForm {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  @Input() docType: string;

  @Input() mode: 'create' | 'edit' = 'create';

  @Input() component: Type<DocumentModelForm>;

  onResponsed: boolean = false;

  response_words: string;

  protected customComponent: ComponentRef<any>;

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(dialogService, queryParamsService);
  }

  protected onInit(): void {
    this.createComponent();
    this.subscribeEventEmitters();
  }

  protected onDestroy(): void {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
    this.subscription.unsubscribe();
  }

  protected createComponent() {
    if (!this.customComponent) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
      this.customComponent = this.dynamicTarget.createComponent(componentFactory);
      this.customComponent.instance.mode = this.mode;
      this.customComponent.instance.docType = this.docType;
      this.customComponent.instance.documentModel = this.document;
    }
  }

  protected subscribeEventEmitters() {
    this.customComponent.instance.onCallback.subscribe(res => {
      if (res.action === 'cancel') {
        this.close();
      } else if (res.action === 'create' || 'update') {
        this.onResponsed = true;
        this.response_words = res.message;
        timer(2000).subscribe(_ => this.close());
        this.refresh();
      }
    });
  }
}
