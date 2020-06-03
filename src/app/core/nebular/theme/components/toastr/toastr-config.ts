/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { InjectionToken } from '@angular/core';

import { NbGlobalLogicalPosition, NbGlobalPosition } from '../cdk';
import { NbComponentStatus } from '../component-status';


export const NB_TOASTR_CONFIG = new InjectionToken<NbToastrConfig>('Default toastr options');

/**
 * The `NbToastrConfig` class describes configuration of the `NbToastrService.show` and global toastr configuration.
 * */
export class NbToastrConfig {
  /**
   * Determines where on the screen toast have to be rendered.
   * */
  position: NbGlobalPosition = NbGlobalLogicalPosition.TOP_END;
  /**
   * Status chooses color scheme for the toast.
   * */
  status: string | NbComponentStatus = 'primary';
  /**
   * Duration is timeout between toast appears and disappears.
   * */
  duration: number = 3000;
  /**
   * Destroy by click means you can hide the toast by clicking it.
   * */
  destroyByClick: boolean = true;
  /**
   * If preventDuplicates is true then the next toast with the same title and message will not be rendered.
   * */
  preventDuplicates: boolean = false;
  /**
   * Determines render icon or not.
   * */
  hasIcon: boolean = false;
  /**
   * Icon class that can be provided to render custom icon.
   * */
  icon: string = 'nb-email';
  /**
   * Toast status icon-class mapping.
   * */
  protected icons = {
    ['danger']: 'nb-danger',
    ['success']: 'nb-checkmark-circle',
    ['info']: 'nb-help',
    ['warning']: 'nb-alert',
    ['primary']: 'nb-email',
  };

  constructor(config: Partial<NbToastrConfig>) {
    this.patchIcon(config);
    Object.assign(this, config);
  }

  protected patchIcon(config: Partial<NbToastrConfig>) {
    if (!('icon' in config)) {
      config.icon = this.icons[config.status || 'primary'];
    }
  }
}
