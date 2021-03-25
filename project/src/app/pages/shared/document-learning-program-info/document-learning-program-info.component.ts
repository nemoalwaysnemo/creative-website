import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentViewerSettings } from '../document-viewer';
import { GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../global-document-form';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'document-learning-program-info',
  styleUrls: ['./document-learning-program-info.component.scss'],
  templateUrl: './document-learning-program-info.component.html',
})

export class DocumentLearningProgramInfoComponent implements OnDestroy {

  protected subscription: Subscription = new Subscription();

  loading: boolean = true;

  doc: DocumentModel;

  hasGroup$: Observable<boolean> = observableOf(true);

  curriculumList: string[] = [];

  dateList: string[] = [];

  durationList: string[] = [];

  logoViewerSettings: DocumentViewerSettings = new DocumentViewerSettings({
    autoplay: false,
    styleName: 'learning-program-logo',
    srcFn: (doc: DocumentModel): string => doc.getCustomFile('app_Learning:program_logo'),
    mimeTypeFn: (doc: DocumentModel): string => 'picture',
  });

  enableThumbnailCreation: boolean = true;

  photoViewerSettings: any = {
    autoplay: false,
    styleName: 'learning-program-photo',
    srcFn: (doc: DocumentModel): string => {
      const files = doc.getCustomFiles('app_Learning:program_photo');
      if (files && files.length > 0) {
        return files[0].url;
      }
      return '/assets/images/no-thumbnail.png';
    },
    mimeTypeFn: (doc: DocumentModel): string => 'picture',
  };

  videoViewerSettings: DocumentViewerSettings = new DocumentViewerSettings({
    styleName: 'learning-program-info',
    autoplay: false,
  });

  previewDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_LEARNING_PROGRAM] });

  editDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_FORM.LEARNING_PROGRAM_FORM] });

  editRedirectUrl: string = this.documentPageService.getCurrentUrl();

  dialogMetadata: any = {
    formMode: 'edit',
  };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      // this.hasGroup$ = this.hasUserGroup();
      this.curriculumList = this.doc.get('app_Learning:program_curriculum');
      this.durationList = this.doc.get('app_Learning:program_duration');
      this.dateList = this.doc.get('app_Learning:program_date');
    }
  }

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService, protected documentPageService: DocumentPageService) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick });
  }

  protected hasUserGroup(): Observable<boolean> {
    return this.documentPageService.getCurrentUser().pipe(map((user: UserModel) => user.hasGroup('XYZ')));
  }

}
