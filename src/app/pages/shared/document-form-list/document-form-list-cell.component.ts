import { Component, forwardRef, ComponentFactoryResolver } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormInstancesService,
} from '../../../core/custom/ng-dynamic-forms';
import { DynamicNGFormControlContainerComponent } from '../dynamic-ng-form/dynamic-ng-form-control-container.component';

@Component({
  selector: 'document-form-list-cell',
  templateUrl: './document-form-list-cell.component.html',
})
export class DocumentFormListCellComponent extends DynamicNGFormControlContainerComponent {

  constructor(protected componentFactoryResolver: ComponentFactoryResolver,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected dynamicFormInstancesService: DynamicFormInstancesService) {
    super(componentFactoryResolver, layoutService, validationService, dynamicFormInstancesService);
  }

}
