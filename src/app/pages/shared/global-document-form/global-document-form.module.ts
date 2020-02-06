import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DocumentFormModule } from '../document-form/document-form.module';
import {
  CreativeAssetImageFormComponent,
  CreativeAssetVideoFormComponent,
  CreativeAssetAudioFormComponent,
  CreativeUsageRightsTalentComponent,
  CreativeUsageRightsMusicComponent,
  CreativeUsageRightsPhotoComponent,
  CreativeUsageRightsStockComponent,
  CreativeCampaignFormComponent,
  CreativeProjectFormComponent,
  DisruptionRoadmapFormComponent,
  DisruptionBrilliantThinkingFormComponent,
  DisruptionDayFolderFormComponent,
  DisruptionDayAssetFormComponent,
  DisruptionHowTosAssetFormComponent,
} from '../global-document-form';

const COMPONENTS = [
  CreativeAssetImageFormComponent,
  CreativeAssetVideoFormComponent,
  CreativeAssetAudioFormComponent,
  CreativeUsageRightsTalentComponent,
  CreativeUsageRightsMusicComponent,
  CreativeUsageRightsPhotoComponent,
  CreativeUsageRightsStockComponent,
  CreativeCampaignFormComponent,
  CreativeProjectFormComponent,
  DisruptionRoadmapFormComponent,
  DisruptionBrilliantThinkingFormComponent,
  DisruptionDayFolderFormComponent,
  DisruptionDayAssetFormComponent,
  DisruptionHowTosAssetFormComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    DocumentFormModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...COMPONENTS,
  ],
})
export class GlobalDocumentFormModule { }
