import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    NgxPermissionsModule.forChild(),
  ],
  exports: [
    NgxPermissionsModule,
  ],
})
export class ACLModule {

}
