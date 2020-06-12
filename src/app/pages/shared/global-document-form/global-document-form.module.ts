import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DocumentFormModule } from '../document-form/document-form.module';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import {
  CreativeAssetImageFormComponent,
  CreativeAssetVideoFormComponent,
  CreativeAssetAudioFormComponent,
  CreativeAssetBrandFormComponent,
  CreativeUsageRightsModelComponent,
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
  IntelligenceBrandsFormComponent,
  IntelligenceAssetFormComponent,
  BizDevCaseStudyFolderFormComponent,
  BizDevCaseStudyAssetFormComponent,
  BizDevThoughtFolderFormComponent,
  BizDevThoughtAssetFormComponent,
  InnovationAssetFormComponent,
  InnovationFolderFormComponent,
} from '../global-document-form';

const COMPONENTS = [
  CreativeAssetImageFormComponent,
  CreativeAssetVideoFormComponent,
  CreativeAssetAudioFormComponent,
  CreativeAssetBrandFormComponent,
  CreativeUsageRightsModelComponent,
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
  IntelligenceBrandsFormComponent,
  IntelligenceAssetFormComponent,
  BizDevCaseStudyFolderFormComponent,
  BizDevCaseStudyAssetFormComponent,
  BizDevThoughtFolderFormComponent,
  BizDevThoughtAssetFormComponent,
  InnovationAssetFormComponent,
  InnovationFolderFormComponent,
  GlobalDocumentFormComponent,
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
