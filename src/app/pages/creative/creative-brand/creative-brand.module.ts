import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandComponent } from './creative-brand.component';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule, PreviewDialogModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    CreativeBrandComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class CreativeBrandModule { }
