import { CreativeAssetImageFormComponent } from './creative-asset-image-form.component';
import { CreativeAssetVideoFormComponent } from './creative-asset-video-form.component';
import { CreativeAssetAudioFormComponent } from './creative-asset-audio-form.component';
import { CreativeUsageRightsModelComponent } from './creative-usage-rights-model-form.component';
import { CreativeUsageRightsMusicComponent } from './creative-usage-rights-music-form.component';
import { CreativeUsageRightsPhotoComponent } from './creative-usage-rights-photo-form.component';
import { CreativeUsageRightsStockComponent } from './creative-usage-rights-stock-form.component';
import { CreativeCampaignFormComponent } from './creative-asset-campaign-form.component';
import { CreativeProjectFormComponent } from './creative-asset-project-form.component';
import { DisruptionRoadmapFormComponent } from './disruption-roadmap-form.compoent';
import { DisruptionDayFolderFormComponent } from './disruption-day-folder-form.compoent';
import { DisruptionBrilliantThinkingFormComponent } from './disruption-brilliant-thinking-form.compoent';
import { DisruptionDayAssetFormComponent } from './disruption-day-asset-form-component';
import { DisruptionHowTosAssetFormComponent } from './disruption-how-tos-asset-form.compoent';
export const GLOBAL_DOCUMENT_FORM = {
  CREATIVE_ASSET_IMAGE_FORM: CreativeAssetImageFormComponent,
  CREATIVE_ASSET_VIDEO_FORM: CreativeAssetVideoFormComponent,
  CREATIVE_ASSET_AUDIO_FORM: CreativeAssetAudioFormComponent,
  CREATIVE_USAGE_RIGHTS_MODEL_FORM: CreativeUsageRightsModelComponent,
  CREATIVE_USAGE_RIGHTS_MUSIC_FORM: CreativeUsageRightsMusicComponent,
  CREATIVE_USAGE_RIGHTS_PHOTO_FORM: CreativeUsageRightsPhotoComponent,
  CREATIVE_USAGE_RIGHTS_STOCK_FORM: CreativeUsageRightsStockComponent,
  CREATIVE_CAMPAIGN_FORM: CreativeCampaignFormComponent,
  CREATIVE_PROJECT_FORM: CreativeProjectFormComponent,
  DISRUPTION_ROADMAP_FORM: DisruptionRoadmapFormComponent,
  DISRUPTION_BRILLIANT_THINKING_FORM: DisruptionBrilliantThinkingFormComponent,
  DISRUPTION_DAY_FORM: DisruptionDayFolderFormComponent,
  DISRUPTION_DAY_ASSET_FORM: DisruptionDayAssetFormComponent,
  DISRUPTION_HOW_TOS_ASSET_FORM: DisruptionHowTosAssetFormComponent,
};

export function GLOBAL_DOCUMENT_FORMS(): any[] {
  return Object.values(GLOBAL_DOCUMENT_FORM);
}
