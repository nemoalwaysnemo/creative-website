import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import {
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbPopoverModule,
  NbAccordionModule,
  NbDialogModule,
  NbToastrModule,
  NbAlertModule,
  NbSpinnerModule,
  NbTooltipModule,
} from '@core/nebular/theme';

import { FooterComponent, HeaderComponent } from './components';
import { LibraryLayoutComponent } from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { ACLModule } from '@core/acl';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ACLModule];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbSidebarModule,
  NbPopoverModule,
  NgbModule,
  NbToastrModule,
  NbAccordionModule,
  NbDialogModule,
  NbAlertModule,
  NbSpinnerModule,
  NbTooltipModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  LibraryLayoutComponent,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot({ name: 'default' }, [DEFAULT_THEME]).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  ...NbDialogModule.forRoot().providers,
  ...NbToastrModule.forRoot().providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS],
  declarations: [...COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}
