import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../global-document-dialog';
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

  programPhotoList: { url: string, type: string, name: string }[] = [];

  programPhoto: { url: string, type: string, name: string };

  curriculumList: string[] = [];

  dateList: string[] = [];

  propertiesList: string[] = [];

  durationList: string[] = [];

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_PROGRAM_NOMINATION] });

  dialogMetadata: any = {
    formMode: 'edit',
  };

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      // this.hasGroup$ = this.hasUserGroup();
      this.programPhoto = this.getProgramFiles('app_Learning:program_photo').shift();
      this.curriculumList = this.doc.get('app_Learning:program_curriculum');
      this.propertiesList = this.doc.get('app_Learning:program_candidate_properties');
      this.durationList = this.doc.get('app_Learning:program_duration');
      this.dateList = this.parseDate();
    }
  }

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService,
              protected documentPageService: DocumentPageService,
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick });
  }

  parseDate(): string[] {
    return this.doc.get('app_Learning:program_dates').map((item: string) => {
      return new DatePipe('en-US').transform(item, 'yyyy-MM-dd');
    });
  }

  getProgramFiles(type: string): { url: string, type: string, name: string }[] {
    return this.doc.getCustomFiles(type);
  }

  protected hasUserGroup(): Observable<boolean> {
    return this.documentPageService.getCurrentUser().pipe(map((user: UserModel) => user.hasGroup('XYZ')));
  }

}
