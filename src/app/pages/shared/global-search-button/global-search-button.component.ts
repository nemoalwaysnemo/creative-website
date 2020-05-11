import { Component, Output, EventEmitter } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';

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


  changeResultView(view: string): void {
    this.currentView = view;
    this.onResultViewChanged.emit(view);
  }

  sliderValueChanged(event: ChangeContext): void {
    console.log(1111, event);
  }

}
