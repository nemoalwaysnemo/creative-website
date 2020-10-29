import { NgModule } from '@angular/core';
import { BaseAuthModule } from './base-auth';
import { NgxPermissionsModule } from 'ngx-permissions';
import { APIModule } from './api';

@NgModule({
  imports: [
    APIModule,
    BaseAuthModule,
    NgxPermissionsModule.forRoot(),
  ],
  exports: [
    NgxPermissionsModule,
  ],
})
export class CoreModule {

}
