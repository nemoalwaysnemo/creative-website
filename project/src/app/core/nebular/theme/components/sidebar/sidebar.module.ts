/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NgModule } from '@angular/core';

import { NbSharedModule } from '../shared/shared.module';

import {
  NbSidebarComponent,
  NbSidebarFooterComponent,
  NbSidebarHeaderComponent,
} from './sidebar.component';


const NB_SIDEBAR_COMPONENTS = [
  NbSidebarComponent,
  NbSidebarFooterComponent,
  NbSidebarHeaderComponent,
];


@NgModule({
  imports: [
    NbSharedModule,
  ],
  declarations: [
    ...NB_SIDEBAR_COMPONENTS,
  ],
  exports: [
    ...NB_SIDEBAR_COMPONENTS,
  ],
})
export class NbSidebarModule {

}
