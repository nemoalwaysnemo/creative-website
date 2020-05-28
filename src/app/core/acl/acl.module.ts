import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ACLService } from './acl.service';

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
