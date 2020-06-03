import {
  Component,
  Input,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Cell } from '../../../lib/data-set/cell';
import { ViewCell } from './view-cell';

@Component({
  selector: 'custom-view-component',
  template: `
    <ng-template #dynamicTarget></ng-template>
  `,
})
export class CustomViewComponent implements OnInit, OnDestroy {

  customComponent: any;

  @Input() cell: Cell;

  @ViewChild('dynamicTarget', { read: ViewContainerRef, static: true }) dynamicTarget: any;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    if (this.cell && !this.customComponent) {
      this.createCustomComponent();
      this.callOnComponentInit();
      this.patchInstance();
    }
  }

  ngOnDestroy(): void {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
  }

  protected createCustomComponent(): void {
    const componentFactory = this.resolver.resolveComponentFactory(this.cell.getColumn().renderComponent);
    this.customComponent = this.dynamicTarget.createComponent(componentFactory);
  }

  protected callOnComponentInit(): void {
    const onComponentInitFunction = this.cell.getColumn().getOnComponentInitFunction();
    onComponentInitFunction && onComponentInitFunction(this.customComponent.instance);
  }

  protected patchInstance(): void {
    Object.assign(this.customComponent.instance, this.getPatch());
  }

  protected getPatch(): ViewCell {
    return {
      value: this.cell.getValue(),
      rowData: this.cell.getRow().getData(),
      settings: this.cell.getColumn().renderComponentData,
    };
  }
}
