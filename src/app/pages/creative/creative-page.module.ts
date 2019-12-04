import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeHomeModule } from './creative-home/creative-home.module';
import { CreativePageComponent } from './creative-page.component';
import { CreativePageRoutingModule } from './creative-page-routing.module';
import { CreativeAssetPageModule } from './creative-asset/creative-asset.module';
import { LibraryManagePageModule } from './library-manage/library-manage.module';
import { FolderManagePageModule } from './folder-manage/folder-manage.module';
import { CreativeBrandModule } from './creative-brand/creative-brand.module';
@NgModule({
  imports: [
    ThemeModule,
    CreativeHomeModule,
    CreativeAssetPageModule,
    FolderManagePageModule,
    LibraryManagePageModule,
    CreativePageRoutingModule,
    CreativeBrandModule,
  ],
  declarations: [
    CreativePageComponent,
  ],
})
export class CreativePageModule {
}
