import { Component } from '@angular/core';
import { FormDailogBodyComponent } from '../../preview-dialog/dailog-bodys/form_dailog_body-component';
import { PreviewDialogService } from '../../preview-dialog/preview-dialog.service';

enum assetTypes {
  thinking = 'App-Disruption-Asset',
  day = 'App-Disruption-Day',
  day_asset = 'App-Disruption-Day-Asset',
  roadmap = 'App-Disruption-Roadmap-Asset',
  theory = 'App-Disruption-Theory-Asset',
}

@Component({
  selector: 'metadata-edit-form-dialog-body',
  styleUrls: ['./metadata-edit-form-dialog.component.scss'],
  templateUrl: './metadata-edit-form-dialog.component.html',
})

export class MetadataEditFormDialogComponent extends FormDailogBodyComponent {

  readonly assetTypes = assetTypes;

  title: string = '';

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'edit';

  protected initDocument(res: any) {
    switch (this.document.type) {
      case assetTypes.thinking:
        this.title = 'Edit Brilliant Thinking';
        break;
      case assetTypes.day:
        this.title = 'Edit Disruption Day';
        break;
      case assetTypes.day_asset:
        this.title = 'Edit Disruption Day Asset';
        break;
      case assetTypes.roadmap:
        this.title = 'Edit Disruption Roadmap';
        break;
      case assetTypes.theory:
        this.title = 'Edit Disruption How tos';
        break;
      default:
        break;
    }
  }
}
