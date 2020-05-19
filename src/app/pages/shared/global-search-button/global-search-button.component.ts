import { Component, Output, EventEmitter } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { SelectableItemService } from '../selectable-item/selectable-item.service';
import { DocumentThumbnailViewService } from '../document-thumbnail-view/document-thumbnail-view.service';

@Component({
  selector: 'global-search-button',
  styleUrls: ['./global-search-button.component.scss'],
  templateUrl: './global-search-button.component.html',
})
export class GlobalSearchButtonComponent {

  sliderMaxValue = 1;

  sliderMinValue = 0;

  sliderStep = 1;

  sliderDefaultValue = 0;

  enableSlider: boolean = true;

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

  currentView: string = 'thumbnailView';

  @Output() onResultViewChanged: EventEmitter<string> = new EventEmitter();

  constructor(
    private thumbnailViewService: DocumentThumbnailViewService,
    private selectableItemService: SelectableItemService,
  ) {

  }

  clearSelectedItems(): void {
    this.selectableItemService.clear();
  }

  changeResultView(view: string): void {
    this.currentView = view;
    this.enableSlider = view === 'thumbnailView';
    this.onResultViewChanged.emit(view);
  }

  sliderValueChanged(event: ChangeContext): void {
    this.thumbnailViewService.triggerEvent({ name: 'SliderValueChanged', payload: event });
  }

}
