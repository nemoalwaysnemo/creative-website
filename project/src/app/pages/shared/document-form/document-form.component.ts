import { Component } from '@angular/core';
import { DocumentModel, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicFormControlModel, DynamicFormModel } from '@core/custom';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { BaseDocumentFormComponent } from './base-document-form.component';
import { DocumentFormSettings } from './document-form.interface';

@Component({
  selector: 'document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent extends BaseDocumentFormComponent {

  protected formName: string = 'document-form';

  showMessageAfterUpload(): boolean {
    return !this.formStatus$.value.submitting && this.formStatus$.value.uploadState === 'uploaded' && this.formSettings.formMode === 'create' && this.formSettings.showUploadMessage;
  }

  showMessageBeforeSuccess(): boolean {
    return this.formStatus$.value.submitting && this.formSettings.showMessageBeforeSave;
  }

  protected performNgFormSettings(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): void {
    const ngFormSettings = new DynamicNGFormSettings();
    ngFormSettings.accordionSettings = this.prepareAccordionTab(doc, user, settings, models);
    ngFormSettings.switchTabSettings = this.prepareSwitchTab(doc, user, settings, models);
    ngFormSettings.formModel = this.createFormModel(models);
    ngFormSettings.enableLayoutRight = settings.enableLayoutRight;
    ngFormSettings.formMode = settings.formMode;
    this.ngFormSettings = ngFormSettings;
  }

  protected prepareAccordionTab(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): any[] {
    const accordionSettings = (settings.accordionSettings || []).filter((item: any) => !item.visibleFn || item.visibleFn(doc, user, settings));
    return accordionSettings.map((s: { name: string, position: string }) => ({ name: s.name, position: s.position, models: models.filter(m => m.accordionTab === s.name) }));
  }

  protected prepareSwitchTab(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): any[] {
    const tabSettings = (settings.switchTabSettings || []).filter((item: any) => !item.visibleFn || item.visibleFn(doc, user, settings));
    return tabSettings.map((s: { name: string, active: boolean, disabledFn?: any }) => ({ name: s.name, active: s.active, disabled: (s.disabledFn && s.disabledFn(doc, user, settings)), models: models.filter(m => m.switchTab === s.name) }));
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
