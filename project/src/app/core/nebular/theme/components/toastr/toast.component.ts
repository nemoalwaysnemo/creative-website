/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

import { NbToast } from './model';


/**
 * The `NbToastComponent` is responsible for rendering each toast with appropriate styles.
 *
 * @styles
 *
 * toastr-bg
 * toastr-padding
 * toastr-fg
 * toastr-border
 * toastr-border-radius
 * toastr-border-color
 */
/**
 * TODO
 * Remove svg icons, include them in font.
 */
@Component({
  selector: 'nb-toast',
  styleUrls: ['./toast.component.scss'],
  templateUrl: './toast.component.html',
})
export class NbToastComponent {
  @Input()
  toast: NbToast;

  @Output() destroy: EventEmitter<void> = new EventEmitter();

  @HostBinding('class.success')
  get success(): boolean {
    return this.toast.config.status === 'success';
  }

  @HostBinding('class.info')
  get info(): boolean {
    return this.toast.config.status === 'info';
  }

  @HostBinding('class.warning')
  get warning(): boolean {
    return this.toast.config.status === 'warning';
  }

  @HostBinding('class.primary')
  get primary(): boolean {
    return this.toast.config.status === 'primary';
  }

  @HostBinding('class.danger')
  get danger(): boolean {
    return this.toast.config.status === 'danger';
  }

  @HostBinding('class.default')
  get default(): boolean {
    return this.toast.config.status === 'basic';
  }

  @HostBinding('class.destroy-by-click')
  get destroyByClick(): boolean {
    return this.toast.config.destroyByClick;
  }

  @HostBinding('class.has-icon')
  get hasIcon(): boolean {
    return this.toast.config.hasIcon && this.toast.config.status !== 'basic';
  }

  @HostBinding('class.custom-icon')
  get customIcon(): boolean {
    return !!this.icon;
  }

  get icon(): string {
    return this.toast.config.icon;
  }

  @HostListener('click')
  onClick(): void {
    this.destroy.emit();
  }
}
