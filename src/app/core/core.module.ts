import { NgModule } from '@angular/core';
import { BaseAuthModule } from './base-auth';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { APIModule } from './api';

@NgModule({
  imports: [
    APIModule,
    BaseAuthModule,
    NgxPermissionsModule.forRoot(),
    DeviceDetectorModule.forRoot(),
  ],
  exports: [
    NgxPermissionsModule,
    DeviceDetectorModule,
  ],
})
export class CoreModule {

}
