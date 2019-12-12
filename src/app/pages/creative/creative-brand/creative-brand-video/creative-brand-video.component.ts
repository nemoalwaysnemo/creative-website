import { Component } from '@angular/core';
import { PreviewDialogService } from '@pages/shared';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';

@Component({
  selector: 'creative-brand-video',
  templateUrl: './creative-brand-video.component.html',
  styleUrls: ['./creative-brand-video.component.scss'],
})
export class CreativeBrandVideoComponent extends FormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

}
