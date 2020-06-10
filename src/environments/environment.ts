// This file is used for local env
export * from './meta-info';

export const Environment = {
  baseTitle: 'Know\\edge',
  homePath: '/p/creative',
  // nuxeoUrl: 'http://localhost:8080/nuxeo/',
  nuxeoUrl: 'https://library-dev.factory.tools/nuxeo/',
  // nuxeoUrl: 'https://library.factory.tools/nuxeo/',
  // nuxeoUrl: 'https://library-staging.factory.tools/nuxeo/',
  backslashAppUrl: 'https://library-dev.factory.tools/nuxeo/edges',
  oauth2CallBackPath: 'https://localhost:4200/#/',
  assetPath: '',
  production: false,
};

export enum NUXEO_PATH_INFO {
  KNOWEDGE_BASIC_PATH = '/know-edge/',
  CREATIVE_BASE_FOLDER_PATH = '/Creative/',
  CREATIVE_TBWA_FOLDER_PATH = '/Creative/TBWA-/',
  CREATIVE_AWARD_FOLDER_PATH = '/Creative/AWARDS/',
  CREATIVE_BEST_ASSETS_PATH = '/Creative/1. GCL Frontpage/Frontpage Assets/',
  BACKSLASH_BASE_FOLDER_PATH = '/know-edge/-backslash/',
  BACKSLASH_EDGE_FOLDER_PATH = '/know-edge/-backslash/Edges/',
  DISRUPTION_BASE_FOLDER_PATH = '/know-edge/Disruption/',
  DISRUPTION_DAYS_PATH = '/know-edge/Disruption/Disruption Days.1555686729451/',
  DISRUPTION_ROADMAPS_PATH = '/know-edge/Disruption/Disruption Roadmaps.1551796258162/',
  DISRUPTION_THEORY_PATH = '/know-edge/Disruption/Disruption Theory/',
  DISRUPTION_THINKING_PATH = '/know-edge/Disruption/Things to Steal/',
  DISRUPTION_AWARD_FOLDER_PATH = '/know-edge/Disruption/Disruption Awards/Carousel/',
  INTELLIGENCE_BASE_FOLDER_PATH = '/know-edge/Intelligence/',
  BIZ_DEV_BASE_FOLDER_PATH = '/know-edge/Business Development/',
  BIZ_DEV_10X_FOLDER_PATH = '/know-edge/Business Development/10x/',
  BIZ_DEV_CASE_STUDIES_FOLDER_PATH = '/know-edge/Business Development/Case Studies/',
  BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH = '/know-edge/Business Development/Thought Leadership/',
  INNOVATION_BASE_FOLDER_PATH = '/know-edge/Innovation.1590029994160/',
  INNOVATION_10X_FOLDER_PATH = '/know-edge/Innovation.1590029994160/10x/',
  INNOVATION_NEXT_FOLDER_PATH = '/know-edge/Innovation.1590029994160/NEXT/',
  INNOVATION_THINGS_TO_STEAL_FOLDER_PATH = '/know-edge/Innovation.1590029994160/Things to Steal/',
}
