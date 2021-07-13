
export class DocumentThumbnailViewSettings {

  [key: string]: any;

  layout: string = 'quarter'; // 'half' | 'third' | 'quarter' | 'suggestion-inline';

  thumbnailType: 'attachedImage' | 'thumbnailUrl' = 'thumbnailUrl';

  loadingStyle: any = { 'min-height': '120px' };

  noResultText: string = 'No data found';

  enableCustomGrid: boolean = false;

  customGridTitle: string = 'New';

  hideEmpty: boolean = false;

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

}
