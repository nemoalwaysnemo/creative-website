
export enum NUXEO_DOC_TYPE {
  CREATIVE_IMAGE_VIDEO_TYPES = '["App-Library-Image", "App-Library-Video"]',
  CREATIVE_IMAGE_VIDEO_AUDIO_TYPES = '["App-Library-Image", "App-Library-Video", "App-Library-Audio"]',
  CREATIVE_DELIVERY_PACKAGE_TYPE = '["App-Library-Delivery-Package"]',
  CREATIVE_IMPORT_REQUEST_TYPE = '["App-Library-Import-Project-Request"]',
  CREATIVE_FOLDER_TYPE = '["App-Library-Folder"]',
  CREATIVE_PROJECT_TYPE = '["App-Library-Project"]',
  CREATIVE_CAMPAIGN_TYPE = '["App-Library-Campaign"]',
  CREATIVE_CAMPAIGN_FOLDER_TYPE = '["App-Library-Campaign-Mgt-Folder"]',
  CREATIVE_UR_FOLDER_TYPE = '["App-Library-UR-Folder"]',
  CREATIVE_BRAND_FOLDER_TYPE = '["Brand Folder"]',
  CREATIVE_AGENCY_FOLDER_TYPE = '["Agency Folder"]',
  CREATIVE_SELECTED_BRAND_TYPE = '["App-Library-Selected-Brand"]',
  CREATIVE_AGENCY_AND_BRAND_FOLDER_TYPE = '["Brand Folder", "Agency Folder"]',
  CREATIVE_UR_CONTRACT_TYPES = '["App-Library-UsageRights-Talent", "App-Library-UsageRights-Music", "App-Library-UsageRights-Photographer", "App-Library-UsageRights-Stock"]',
  CREATIVE_UR_TALENT_TYPE = '["App-Library-UsageRights-Talent"]',
  BACKSLASH_ASSET_TYPES = '["App-Backslash-Article", "App-Backslash-Video", "App-Backslash-Case-Study", "App-Backslash-Edges-Asset", "App-Backslash-Resources-Asset"]',
  BACKSLASH_ARTICLE_VIDEO_POST_TYPES = '["App-Backslash-Article", "App-Backslash-Video", "App-Backslasht-Post"]',
  BACKSLASH_CASE_STUDIES_BASE_FOLDER_TYPE = '["App-Backslash-Case-Studies-Folder"]',
  BACKSLASH_CASE_STUDIES_ALL_FOLDER_TYPE = '["App-Backslash-Case-Study-Folder", "App-Backslash-Case-Study-Category", "App-Backslash-Case-Studies-Folder", "App-Backslash-Case-Study-Region"]',
  BACKSLASH_CASE_STUDIES_SUB_FOLDER_TYPE = '["App-Backslash-Case-Study-Folder", "App-Backslash-Case-Study", "App-Backslash-Case-Study-Category", "App-Backslash-Case-Study-Region"]',
  BACKSLASH_CASE_STUDIES_FOLDER_ASSETS = '["App-Backslash-Case-Study-Folder", "App-Backslash-Case-Study"]',
  BACKSLASH_CASE_STUDIES_ASSET_TYPE = '["App-Backslash-Case-Study"]',
  BACKSLASH_CATEGORY_FOLDER_TYPE = '["App-Backslash-Case-Study-Category"]',
  BACKSLASH_REGION_FOLDER_TYPE = '["App-Backslash-Case-Study-Region"]',
  BACKSLASH_DOCUMENT_FOLDER_TYPE = '["App-Backslash-Asset-Document"]',
  BACKSLASH_ASSET_FOLDER_TYPE = '["App-Backslash-Asset-Folder"]',
  BACKSLASH_EDGE_ASSET_TYPE = '["App-Backslash-Edges-Asset"]',
  BACKSLASH_EDGE_FOLDER_TYPE = '["App-Backslash-Edges-Assetfolder"]',
  BACKSLASH_EDGE_BASE_FOLDER_TYPE = '["App-Backslash-Edges-Folder"]',
  BACKSLASH_EDGE_SUB_FOLDER_TYPE = '["App-Backslash-Edges-Assetfolder", "App-Backslash-Edges-Asset"]',
  BACKSLASH_EDGE_ALL_FOLDER_TYPE = '["App-Backslash-Edges-Assetfolder", "App-Backslash-Edges-Folder"]',
  BACKSLASH_RESOURCES_BASE_FOLDER_TYPE = '["App-Backslash-Resources-Folder"]',
  BACKSLASH_RESOURCES_FOLDER_TYPE = '["App-Backslash-Resources-Assetfolder"]',
  BACKSLASH_RESOURCES_ASSET_TYPE = '["App-Backslash-Resources-Asset"]',
  BACKSLASH_RESOURCES_SUB_FOLDER_TYPE = '["App-Backslash-Resources-Assetfolder", "App-Backslash-Resources-Asset"]',
  BACKSLASH_RESOURCES_ALL_FOLDER_TYPE = '["App-Backslash-Resources-Folder", "App-Backslash-Resources-Assetfolder"]',
  BACKSLASH_ASSET_TYPE = '["App-Backslash-Edges-Asset", "App-Backslash-Case-Study", "App-Backslash-Resources-Asset", "App-Edges-Trigger"]',
  BACKSLASH_FOLDER_TYPE = '["App-Backslash-Folder"]',
  BACKSLASH_SUB_FOLDER_TYPE = '["App-Backslash-Resources-Folder", "App-Backslash-Case-Studies-Folder", "App-Backslash-Edges-Folder"]',
  BACKSLASH_TRIGGER_TYPE = '["App-Edges-Trigger"]',
  BACKSLASH_TRIGGER_SUB_FOLDER_TYPE = '["App-Edges-Folder"]',
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
  DISRUPTION_ASSET_TYPE = '["App-Disruption-Asset", "App-Disruption-Roadmap-Asset", "App-Disruption-Theory-Asset", "App-Disruption-Day-Asset", "App-Disruption-Day", "App-DisruptionX-Module"]',
  DISRUPTION_AWARD_ASSET_TYPE = '["App-Disruption-Awards-Asset"]',
  DISRUPTION_AWARD_FOLDER_TYPE = '["App-Disruption-Awards-Folder"]',
  DISRUPTION_X_FOLDER_TYPE = '["App-DisruptionX-Modules-Folder"]',
  DISRUPTION_X_TYPE = '["App-DisruptionX-Module"]',
  INTELLIGENCE_FOLDER_TYPE = '["App-Intelligence-Consumer-Folder", "App-Intelligence-Industry-Folder", "App-Intelligence-Marketing-Folder"]',
  INTELLIGENCE_BASE_FOLDER_TYPE = '["App-Intelligence-Folder"]',
  INTELLIGENCE_BRANDS_TYPE = '["App-Intelligence-Brands-Folder"]',
  INTELLIGENCE_INDUSTRY_TYPE = '["App-Intelligence-Industry"]',
  INTELLIGENCE_ASSET_TYPE = '["App-Intelligence-Asset"]',
  INTELLIGENCE_ALL_FOLDERS = '["App-Intelligence-Consumer-Folder", "App-Intelligence-Industry-Folder", "App-Intelligence-Marketing-Folder", "App-Intelligence-Industry", "App-Intelligence-Brands-Folder"]',
  BIZ_DEV_CASE_STUDIES_BASE_FOLDER_TYPE = '["App-BizDev-Case-Studies-Folder"]',
  BIZ_DEV_CASE_STUDIES_FOLDER_TYPE = '["App-BizDev-CaseStudy-Folder"]',
  BIZ_DEV_CASE_STUDIES_ASSET_TYPE = '["App-BizDev-CaseStudy-Asset"]',
  BIZ_DEV_CASE_STUDIES_SUB_FOLDER_TYPE = '["App-BizDev-CaseStudy-Folder", "App-BizDev-CaseStudy-Asset"]',
  BIZ_DEV_THOUGHT_LEADERSHIP_BASE_FOLDER_TYPE = '["App-BizDev-ThoughtLeadership-Folder"]',
  BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_TYPE = '["App-BizDev-Thought-Folder"]',
  BIZ_DEV_THOUGHT_LEADERSHIP_ASSET_TYPE = '["App-BizDev-Thought-Asset"]',
  BIZ_DEV_THOUGHT_LEADERSHIP_SUB_FOLDER_TYPE = '["App-BizDev-Thought-Folder", "App-BizDev-Thought-Asset"]',
  BIZ_DEV_SUB_FOLDER_TYPES = '["App-BizDev-Case-Studies-Folder", "App-BizDev-ThoughtLeadership-Folder"]',
  BIZ_DEV_SEARCH_TYPE = '["App-BizDev-CaseStudy-Folder", "App-BizDev-CaseStudy-Asset", "App-BizDev-Thought-Folder", "App-BizDev-Thought-Asset"]',
  BIZ_DEV_FOLDER_TYPE = '["App-BizDev-Folder"]',
  BIZ_DEV_ASSET_TYPE = '["App-BizDev-CaseStudy-Asset", "App-BizDev-Thought-Asset"]',
  BIZ_DEV_ALL_FOLDER_TYPES = '["App-BizDev-Case-Studies-Folder", "App-BizDev-ThoughtLeadership-Folder", "App-BizDev-Folder", "App-BizDev-Thought-Folder", "App-BizDev-CaseStudy-Folder"]',
  INNOVATION_MODULE_TYPE = '["App-Innovation-Module"]',
  INNOVATION_FOLDER_TYPE = '["App-Innovation-Folder"]',
  INNOVATION_ASSET_TYPE = '["App-Innovation-Asset"]',
  INNOVATION_SEARCH_TYPE = '["App-Innovation-Folder", "App-Innovation-Asset"]',
  FRONTPAGE_BANNER_TYPE = '["App-Library-Image"]',
  KNOWLEDGE_ASSET_TYPE = '["App-Library-Image", "App-Library-Video", "App-Library-Audio", "App-Backslash-Article", "App-Backslash-Video", "App-Intelligence-Asset", "App-Innovation-Asset", "App-BizDev-CaseStudy-Asset", "App-BizDev-Thought-Asset", "App-Disruption-Asset", "App-Disruption-Roadmap-Asset", "App-Disruption-Theory-Asset", "App-Disruption-Day-Asset"]',
  BACKSLASH_ASSET_PAGE_PROVIDER = 'creative_website_backslash_related_assets',
  DISRUPTION_ASSET_PAGE_PROVIDER = 'creative_website_disruption_related_assets',
  INTELLIGENCE_ASSET_PAGE_PROVIDER = 'creative_website_intelligence_related_assets',
}

export enum EXTERNAL_LINK {
}
