import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import {
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

  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicRatingModel;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(NgbRating) ngbRating: NgbRating;

  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    public config: NgbRatingConfig) {

    super(layoutService, validationService);
  }
}