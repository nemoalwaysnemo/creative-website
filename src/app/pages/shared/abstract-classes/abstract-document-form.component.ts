import { Component, Input, Output, EventEmitter, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentModel } from '@core/api';

export interface DocumentModelForm {
  mode: string;
  docType: string;
  document: DocumentModel;
  setTargetModel(doc: DocumentModel);
}

export abstract class AbstractDocumentFormComponent implements DocumentModelForm, OnInit, OnDestroy {

  @Input() document: DocumentModel;

  @Input() docType: string;

  @Input() mode: 'create' | 'edit' = 'create';

  @Output() onCreated: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();
  @Output() onUpdated: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();
  @Output() onCanceled: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  formLayout: any = {};

  settings: any[] = [];

  accordions: any = {};

  protected subscription: Subscription = new Subscription();

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  setTargetModel(doc: DocumentModel) {
    if (this.mode === 'create') {
      this.document = doc.newInstance(this.docType);
    } else if (this.mode === 'edit') {
      this.document = doc;
    }
  }

  protected onInit(): void {
    this.performForm();
    if (this.mode === 'create') {
      this.setDefaultValue();
    }
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  public created(docs: DocumentModel[]): void {
  }

  public updated(doc: DocumentModel): void {
  }

  public canceled(doc: DocumentModel): void {
    this.onCanceled.next(doc);
  }


  protected performForm(): void {
    this.settings = this.getSettings();
    this.formLayout = this.getFormLayout();
    this.accordions = this.getAccordionSettings();
  }

  private setDefaultValue() {
    const settings = this.getSettings();
    settings.filter((setting: any) => !!setting.default && setting.formMode !== 'edit').forEach(setting => {
      this.document.properties[setting.id] = setting.default;
    });
  }

  protected abstract getSettings(): any[];
  protected abstract getFormLayout(): any;
  protected abstract getAccordionSettings(): any;
}
