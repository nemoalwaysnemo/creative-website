import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentModel } from '@core/api';
import { DynamicFormService, DynamicFormControlModel } from '@core/custom';
import { BASIC_SAMPLE_FORM_MODEL } from './document-form.model';


@Component({
  selector: 'tbwa-document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent implements OnInit {

  formModel: DynamicFormControlModel[];

  formGroup: FormGroup;

  @Input() document: DocumentModel;
  @Input() placeholder: string;

  constructor(private formService: DynamicFormService) {
    this.formModel = this.formService.fromJSON(JSON.stringify(BASIC_SAMPLE_FORM_MODEL));
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  ngOnInit() {

  }

  onBlur($event) {
    console.log(`BLUR event on ${$event.model.id}: `, $event);
  }

  onChange($event) {
    console.log(`CHANGE event on ${$event.model.id}: `, $event);
  }

  onFocus($event) {
    console.log(`FOCUS event on ${$event.model.id}: `, $event);
  }
}
