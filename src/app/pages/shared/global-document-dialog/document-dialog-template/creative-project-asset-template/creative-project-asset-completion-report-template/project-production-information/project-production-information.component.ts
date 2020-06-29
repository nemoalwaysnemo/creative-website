import { Component } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicCheckboxModel, DynamicDragDropFileZoneModel } from '@core/custom';
@Component({
  selector: 'project-production-information',
  styleUrls: ['./project-production-information.scss'],
  templateUrl: './project-production-informatione.component.html',
})
export class ProjectProductionInformationComponent {

  showForm: boolean = false;

  changeView(): void {
    this.showForm = !this.showForm;
  }

  settings: any[] = [];
}
