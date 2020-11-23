import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps.component';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, DocumentFeaturedCarouselModule, GlobalDocumentDialogModule } from '@pages/shared';
import { DisruptionTabInfoModule } from '../disruption-tab-info/disruption-tab-info.module';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';
import { DisruptionRoadmapsGalleryComponent } from './disruption-roadmaps-gallery/disruption-roadmaps-gallery.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalDocumentDialogModule,
    DisruptionTabInfoModule,
    DisruptionFormButtonModule,
    DocumentFeaturedCarouselModule,
  ],
  declarations: [
    DisruptionRoadmapsComponent,
    DisruptionRoadmapsGalleryComponent,
  ],
})
export class DisruptionRoadmapsModule { }
