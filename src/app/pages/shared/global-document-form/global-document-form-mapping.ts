import { CreativeAssetImageFormComponent } from './creative-asset-image-form.component';
import { CreativeAssetVideoFormComponent } from './creative-asset-video-form.component';
import { CreativeAssetAudioFormComponent } from './creative-asset-audio-form.component';
import { CreativeUsageRightsModelComponent } from './creative-usage-rights-model-form.component';
import { CreativeUsageRightsMusicComponent } from './creative-usage-rights-music-form.component';
import { CreativeUsageRightsPhotoComponent } from './creative-usage-rights-photo-form.component';
import { CreativeUsageRightsStockComponent } from './creative-usage-rights-stock-form.component';

export const GLOBAL_DOCUMENT_FORM = {
  CREATIVE_ASSET_IMAGE_FORM: CreativeAssetImageFormComponent,
  CREATIVE_ASSET_VIDEO_FORM: CreativeAssetVideoFormComponent,
  CREATIVE_ASSET_AUDIO_FORM: CreativeAssetAudioFormComponent,
  CREATIVE_USAGE_RIGHTS_MODEL_FORM: CreativeUsageRightsModelComponent,
  CREATIVE_USAGE_RIGHTS_MUSIC_FORM: CreativeUsageRightsMusicComponent,
  CREATIVE_USAGE_RIGHTS_PHOTO_FORM: CreativeUsageRightsPhotoComponent,
  CREATIVE_USAGE_RIGHTS_STOCK_FORM: CreativeUsageRightsStockComponent,
};

export function GLOBAL_DOCUMENT_FORMS(): any[] {
  return Object.values(GLOBAL_DOCUMENT_FORM);
}
