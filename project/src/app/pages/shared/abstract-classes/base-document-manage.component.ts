import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of as observableOf } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { DocumentModel, NuxeoPermission, UserModel } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { GlobalDocumentViewComponent } from './global-document-view.component';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  template: '',
})
export class BaseDocumentManageComponent extends GlobalDocumentViewComponent {

  tabs: any[] = [];

  formSettings: DocumentFormSettings;

  protected tabConfig: any[];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    super.onInit();
    this.performForm();
  }

  protected getDocumentFormSettings(): DocumentFormSettings {
    const settings = this.getFormSettings();
    settings.accordionSettings = this.getFormAccordion();
    settings.switchTabSettings = this.getFormSwitchTab();
    settings.formModel = this.getFormModels();
    return new DocumentFormSettings(settings);
  }

  protected getFormSettings(): any {
    return {};
  }

  protected getFormAccordion(): any[] {
    return [];
  }

  protected getFormSwitchTab(): any[] {
    return [];
  }

  protected getFormModels(): any[] {
    return [];
  }

  protected performForm(): void {
    this.formSettings = this.getDocumentFormSettings();
  }

  protected setCurrentDocument(doc: DocumentModel, user?: UserModel): void {
    super.setCurrentDocument(doc, user);
    if (doc) {
      this.hasPermission(doc).subscribe((hasPermission: boolean) => {
        if (!hasPermission) {
          this.documentPageService.redirectTo403();
        }
      });
    }
  }

  protected hasPermission(doc: DocumentModel): Observable<boolean> {
    return combineLatest([
      doc.hasPermission(NuxeoPermission.Write),
      doc.hasPermission(NuxeoPermission.Everything),
    ]).pipe(
      map(results => (results[0] || results[1])),
      share(),
    );
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_AGENCY_AND_BRAND_FOLDER_TYPE,
    };
  }
}
