import { NgModule } from '@angular/core';
import { BaseAuthModule } from './base-auth';
import { APIModule } from './api';

@NgModule({
  imports: [
    APIModule,
    BaseAuthModule,
  ],
})
export class CoreModule {

}
