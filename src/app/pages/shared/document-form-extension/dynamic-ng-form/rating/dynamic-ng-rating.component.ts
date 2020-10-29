import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlCustomEvent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormControlComponent,
  DynamicRatingModel,
} from '@core/custom';

@Component({
  selector: 'dynamic-ng-rating',
  templateUrl: './dynamic-ng-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicNGRatingComponent extends DynamicFormControlComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicRatingModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter<DynamicFormControlCustomEvent>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(NgbRating, { static: true }) ngbRating: NgbRating;

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              public config: NgbRatingConfig) {

    super(layoutService, validationService);
  }
}
