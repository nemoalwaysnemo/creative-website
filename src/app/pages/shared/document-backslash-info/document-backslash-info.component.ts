import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'document-backslash-info',
  styleUrls: ['./document-backslash-info.component.scss'],
  templateUrl: './document-backslash-info.component.html',
})
export class DocumentBackslashInfoComponent {

  @Input() document: DocumentModel;

}
