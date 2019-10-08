
export const Environment = {
  title: 'Know\\edge',
  homePath: '/p/creative',
  appName: 'Creative Library',
  nuxeoUrl: '/nuxeo/',
  backslashAppUrl: '/nuxeo/edges',
  assetPath: '/nuxeo/LibraryWebUI/',
  oauth2CallBackPath: '/nuxeo/site/LibraryWebUI/',
  production: true,
};

export enum NUXEO_PATH_INFO {
  KNOWEDGE_BASIC_PATH = '/know-edge/',
  CREATIVE_BASE_FOLDER_PATH = '/Creative/',
  CREATIVE_TBWA_FOLDER_PATH = '/Creative/TBWA-/',
  CREATIVE_AWARD_FOLDER_PATH = '/Creative/AWARDS/',
  CREATIVE_BEST_ASSETS_PATH = '/Creative/1. GCL Frontpage/Frontpage Assets/',
  BACKSLASH_BASE_FOLDER_PATH = '/know-edge/-backslash/',
  DISRUPTION_BASE_FOLDER_PATH = '/know-edge/Disruption/',
  DISRUPTION_DAYS_PATH = '/know-edge/Disruption/Disruption Days/',
  DISRUPTION_ROADMAPS_PATH = '/know-edge/Disruption/Disruption Roadmaps/',
  DISRUPTION_THEORY_PATH = '/know-edge/Disruption/Disruption How Tos/',
  DISRUPTION_THINKING_PATH = '/know-edge/Disruption/Brilliant Thinking/',
  DISRUPTION_AWARD_FOLDER_PATH = '/know-edge/Disruption/Disruption Awards/Carousel/',
  INTELLIGENCE_BASE_FOLDER_PATH = '/know-edge/Intelligence/',
  FRONTPAGE_BANNER_PATH = '/Creative/1. GCL Frontpage/Banners/',
}

export enum NUXEO_META_INFO {
  CREATIVE_IMAGE_VIDEO_TYPES = '["App-Library-Image", "App-Library-Video"]',
  CREATIVE_IMAGE_VIDEO_AUDIO_TYPES = '["App-Library-Image", "App-Library-Video", "App-Library-Audio"]',
  CREATIVE_FOLDER_TYPES = '["App-Library-Folder"]',
  CREATIVE_PROJECT_TYPES = '["App-Library-Project"]',
  CREATIVE_BRAND_FOLDER_TYPE = '["Brand Folder"]',
  CREATIVE_SELECTED_BRAND_TYPE = '["App-Library-Selected-Brand"]',
  CREATIVE_AGENCY_FOLDER_TYPE = '["Agency Folder"]',
  DISRUPTION_DAYS_TYPE = '["App-Disruption-Day"]',
  DISRUPTION_DAY_ASSET_TYPES = '["App-Disruption-Asset", "App-Disruption-Day-Asset"]',
  DISRUPTION_ROADMAP_TYPE = '["App-Disruption-Roadmap-Asset"]',
  DISRUPTION_THEORY_TYPE = '["App-Disruption-Theory-Asset"]',
  DISRUPTION_THINKING_TYPE = '["App-Disruption-Asset"]',
  DISRUPTION_ROADMAP_FOLDER_TYPE = '["App-Disruption-Roadmap-Folder"]',
  DISRUPTION_DAYS_FOLDER_TYPE = '["App-Disruption-Days-Folder"]',
  DISRUPTION_THEORY_FOLDER_TYPE = '["App-Disruption-Theory-Folder"]',
  DISRUPTION_THINKING_FOLDER_TYPE = '["App-Disruption-Folder"]',
  DISRUPTION_FOLDER_TYPE = '["App-Disruption-Roadmap-Folder", "App-Disruption-Days-Folder", "App-Disruption-Theory-Folder", "App-Disruption-Folder"]',
  DISRUPTION_ASSET_TYPE = '["App-Disruption-Asset", "App-Disruption-Roadmap-Asset", "App-Disruption-Theory-Asset", "App-Disruption-Day-Asset", "App-Disruption-Day"]',
  DISRUPTION_AWARD_ASSET_TYPE = '["App-Disruption-Awards-Asset"]',
  DISRUPTION_AWARD_FOLDER_TYPE = '["App-Disruption-Awards-Folder"]',
  INTELLIGENCE_FOLDER_TYPE = '["App-Intelligence-Consumer-Folder", "App-Intelligence-Industry-Folder", "App-Intelligence-Marketing-Folder"]',
  INTELLIGENCE_INDUSTRY_TYPE = '["App-Intelligence-Industry"]',
  INTELLIGENCE_ASSET_TYPE = '["App-Intelligence-Asset"]',
  INTELLIGENCE_ALL_FOLDERS = '["App-Intelligence-Consumer-Folder", "App-Intelligence-Industry-Folder", "App-Intelligence-Marketing-Folder", "App-Intelligence-Industry"]',
  FRONTPAGE_BANNER_TYPE = '["App-Library-Image"]',
  BACKSLASH_ASSET_PAGE_PROVIDER = 'creative_website_backslash_related_assets',
  DISRUPTION_ASSET_PAGE_PROVIDER = 'creative_website_disruption_related_assets',
  INTELLIGENCE_ASSET_PAGE_PROVIDER = 'creative_website_intelligence_related_assets',
  USER_COLLECTION_PAGE_PROVIDER = 'creative_website_user_collections',
  USER_COLLECTION_MEMBERS_PAGE_PROVIDER = 'creative_website_user_collection_members',
}
