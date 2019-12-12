import { Component } from '@angular/core';
import { PreviewDialogService } from '@pages/shared';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'creative-brand-audio',
  templateUrl: './creative-brand-audio.component.html',
  styleUrls: ['./creative-brand-audio.component.scss'],
})
export class CreativeBrandAudioComponent extends FormDailogBody {

  constructor(
    protected dialogService: PreviewDialogService,
    protected activatedRoute: ActivatedRoute,
  ) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

}
