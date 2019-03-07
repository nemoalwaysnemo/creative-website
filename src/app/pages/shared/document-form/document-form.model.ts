import {
  DynamicSuggestionModel,
  DynamicBatchUploadModel,
} from '@core/custom';

export const BASIC_SAMPLE_FORM_MODEL = [

  new DynamicSuggestionModel<string>({
    id: 'app_Edges:Tags_edges1',
    label: 'App-Edges-Edges',
    directoryName: 'App-Edges-Edges',
    placeholder: 'Please select edges',
  }),
  new DynamicSuggestionModel<string>({
    id: 'app_Edges:Tags_edges2',
    label: 'App-Edges-Edges',
    directoryName: 'App-Edges-Edges',
    placeholder: 'Please select edges',
    suggestion: false,
  }),

  new DynamicBatchUploadModel<string>({
    id: 'testfiles',
    label: 'test files',
    placeholder: 'Drop files here!!!',
  }),
];
