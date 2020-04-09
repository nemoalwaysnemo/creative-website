import { NgModule, ModuleWithProviders } from '@angular/core';
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
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ACLModule,
      providers: [
        ACLService,
      ],
    };
  }
}
