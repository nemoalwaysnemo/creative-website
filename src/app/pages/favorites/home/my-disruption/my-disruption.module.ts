import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { MyDisruptionComponent } from './my-disruption.component';
import { FavoritesThumbnailViewModule } from '../../favorites-shared/favorites-thumbnail-view/favorites-thumbnail-view.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    FavoritesThumbnailViewModule,
  ],
  declarations: [
    MyDisruptionComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class MyDisruptionModule { }
