
export class SelectableActionBarSettings {

  enableDeleteDocuments: boolean = false;

  enableAddToFavorites: boolean = true;

  enableRemoveFromFavorites: boolean = false;

  enableAddToShowcase: boolean = false;

  enableRemoveFromShowcase: boolean = false;

  enableAddToCollection: boolean = false;

  enableRemoveFromCollection: boolean = false;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
