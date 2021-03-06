/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, ComponentRef, ViewChild } from '@angular/core';

import { NbComponentPortal, NbOverlayContainerComponent, NbPositionedContainerComponent } from '../cdk';


@Component({
  selector: 'nb-datepicker-container',
  styleUrls: ['./datepicker-container.component.scss'],
  template: `
    <span class="arrow"></span>
    <nb-overlay-container></nb-overlay-container>
  `,
})
export class NbDatepickerContainerComponent extends NbPositionedContainerComponent {
  @ViewChild(NbOverlayContainerComponent, { static: true }) overlayContainer: NbOverlayContainerComponent;

  attach<T>(portal: NbComponentPortal<T>): ComponentRef<T> {
    return this.overlayContainer.attachComponentPortal(portal);
  }
}
