import { Component } from '@angular/core';
import { NuxeoUploadResponse } from '@core/api';
import { DynamicFormControlModel, DynamicFormModel } from '@core/custom';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { BaseDocumentFormComponent } from './base-document-form.component';
import { DocumentFormContext } from './document-form.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent extends BaseDocumentFormComponent {

  modelOperation: Subject<{ model: string, type: string }> = new Subject();

  showMessageAfterUpload(): boolean {
    return !this.formStatus$.value.submitting && this.formStatus$.value.uploadState === 'uploaded' && this.ctx.formSettings.formMode === 'create' && this.ctx.formSettings.showUploadMessage;
  }

  showMessageBeforeSuccess(): boolean {
    return this.formStatus$.value.submitting && this.ctx.formSettings.showMessageBeforeSave;
  }

  protected performNgFormSettings(ctx: DocumentFormContext, formModel: DynamicFormModel): void {
    const ngFormSettings = new DynamicNGFormSettings();
    ngFormSettings.accordionSettings = this.prepareAccordionTab(ctx, formModel);
    ngFormSettings.switchTabSettings = this.prepareSwitchTab(ctx, formModel);
    ngFormSettings.formModel = this.createFormModel(formModel);
    ngFormSettings.enableLayoutRight = ctx.formSettings.enableLayoutRight;
    ngFormSettings.formMode = ctx.formSettings.formMode;
    this.ngFormSettings = ngFormSettings;
  }

  protected prepareAccordionTab(ctx: DocumentFormContext, formModel: DynamicFormModel): any[] {
    const accordionSettings = (ctx.formSettings.accordionSettings || []).filter((item: any) => !item.visibleFn || item.visibleFn(ctx));
    return accordionSettings.map((s: { name: string, position: string }) => ({ name: s.name, position: s.position, models: formModel.filter(m => m.accordionTab === s.name) }));
  }

  protected prepareSwitchTab(ctx: DocumentFormContext, formModel: DynamicFormModel): any[] {
    const s = (ctx.formSettings.switchTabSettings || []).filter((item: any) => !item.visibleFn || item.visibleFn(ctx));
    return s.map((x: { name: string, active: boolean, disabledFn?: any }) => ({ name: x.name, active: x.active, disabled: (x.disabledFn && x.disabledFn(ctx)), models: formModel.filter(m => m.switchTab === x.name) }));
  }

  protected onUploadFileSelected(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, added: NuxeoUploadResponse[]): void {
    this.hideControls(uploadModel, settings);
    this.setDocumentTitle(uploadModel, settings, added[0]);
  }

  protected hideControls(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings): void {
    if (settings.formMode === 'create') {
      const type = uploadModel.settings.enableForm ? 'delete' : 'show';
      this.modelOperation.next({ model: 'dc:title', type });
    }
  }

  protected setDocumentTitle(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, res: NuxeoUploadResponse): void {
    if (settings.formMode === 'create' && !uploadModel.settings.enableForm && !this.getFormValue('dc:title')) {
      this.formGroup.patchValue({ 'dc:title': this.filterFileName(res.fileName) });
    }
  }
}
