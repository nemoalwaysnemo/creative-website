import { Component } from '@angular/core';
import { PreviewDialogService } from '@pages/shared';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';

@Component({
  selector: 'creative-brand-image',
  templateUrl: './creative-brand-image.component.html',
  styleUrls: ['./creative-brand-image.component.scss'],
})
export class CreativeBrandImageComponent extends FormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

}
