import { Component, forwardRef, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import {
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormComponentService,
  DynamicFormRelationService,
} from '@core/custom/ng-dynamic-forms';
import { DynamicNGFormControlContainerComponent } from '../dynamic-ng-form/dynamic-ng-form-control-container.component';

@Component({
  selector: 'document-field-list-cell',
  templateUrl: './document-field-list-cell.component.html',
})
export class DocumentFieldListCellComponent extends DynamicNGFormControlContainerComponent {

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected componentFactoryResolver: ComponentFactoryResolver,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected componentService: DynamicFormComponentService,
              protected relationService: DynamicFormRelationService) {

    super(changeDetectorRef, componentFactoryResolver, layoutService, validationService, componentService, relationService);
  }
}
