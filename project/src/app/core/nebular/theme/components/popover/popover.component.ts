/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  Component,
  ComponentFactoryResolver,
  Input,
  TemplateRef,
  Type,
  ViewChild,
} from '@angular/core';
import {
  NbComponentPortal,
  NbOverlayContainerComponent,
  NbPositionedContainerComponent,
  NbRenderableContainer,
  NbTemplatePortal,
} from '../cdk';


/**
 * Overlay container.
 * Renders provided content inside.
 *
 * @styles
 *
 * popover-fg
 * popover-bg
 * popover-border
 * popover-shadow
 */
@Component({
  selector: 'nb-popover',
  styleUrls: ['./popover.component.scss'],
  template: `
    <span class="arrow"></span>
    <nb-overlay-container></nb-overlay-container>
  `,
})
export class NbPopoverComponent extends NbPositionedContainerComponent implements NbRenderableContainer {
  @ViewChild(NbOverlayContainerComponent, { static: true }) overlayContainer: NbOverlayContainerComponent;

  @Input() content: any;
  @Input() context: any;
  @Input() cfr: ComponentFactoryResolver;

  renderContent(): void {
    this.detachContent();
    this.attachContent();
  }

  protected detachContent(): void {
    this.overlayContainer.detach();
  }

  protected attachContent(): void {
    if (this.content instanceof TemplateRef) {
      this.attachTemplate();
    } else if (this.content instanceof Type) {
      this.attachComponent();
    } else {
      this.attachString();
    }
  }

  protected attachTemplate(): void {
    this.overlayContainer
      .attachTemplatePortal(new NbTemplatePortal(this.content, null, { $implicit: this.context } as any));
  }

  protected attachComponent(): void {
    const portal = new NbComponentPortal(this.content, null, null, this.cfr);
    const ref = this.overlayContainer.attachComponentPortal(portal);
    Object.assign(ref.instance, this.context);
    ref.changeDetectorRef.detectChanges();
  }

  protected attachString(): void {
    this.overlayContainer.attachStringContent(this.content);
  }
}
