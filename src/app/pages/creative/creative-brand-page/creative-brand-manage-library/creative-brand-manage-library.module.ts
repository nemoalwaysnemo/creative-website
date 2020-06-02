import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandManageLibraryComponent } from './creative-brand-manage-library.component';
import { SharedModule } from '@pages/shared/shared.module';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    CreativeBrandInfoViewModule,
  ],
  declarations: [
    CreativeBrandManageLibraryComponent,
  ],
})
export class CreativeBrandManageLibraryModule { }
