import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { DocumentThumbnailViewService } from '../document-thumbnail-view/document-thumbnail-view.service';

@Component({
  selector: 'global-search-button',
  styleUrls: ['./global-search-button.component.scss'],
  templateUrl: './global-search-button.component.html',
})
export class GlobalSearchButtonComponent {

  currentView: string = 'thumbnailView';

  enableSliderAction: boolean = false;

  enableSliderBar: boolean = false;

  sliderMaxValue: number = 1;

  sliderMinValue: number = 0;

  sliderStep: number = 1;

  sliderDefaultValue: number = 0;

  sliderOptions: Options = {
    floor: 0,
    ceil: 1,
    translate: (value: number): string => {
      switch (value) {
        case 0:
          return 'Normal size';
        case 1:
          return 'Half size';
        default:
          return '';
      }
    },
  };

  @Input()
  set enableSlider(enableSlider: boolean) {
    this.enableSliderAction = enableSlider;
    this.enableSliderBar = enableSlider;
  }

  @Input() enableViewSwitcher: boolean = false;

  @Output() onResultViewChanged: EventEmitter<string> = new EventEmitter();

  constructor(private thumbnailViewService: DocumentThumbnailViewService) {

  }

  changeResultView(view: string): void {
    this.currentView = view;
    this.enableSliderBar = this.enableSliderAction && view === 'thumbnailView';
    this.onResultViewChanged.emit(view);
  }

  sliderValueChanged(event: ChangeContext): void {
    this.thumbnailViewService.triggerEvent({ name: 'SliderValueChanged', payload: event });
  }

}
