import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'global-search-button',
  styleUrls: ['./global-search-button.component.scss'],
  templateUrl: './global-search-button.component.html',
})
export class GlobalSearchButtonComponent {

  currentView: string = 'thumbnailView';

  @Output() resultViewChange: EventEmitter<string> = new EventEmitter();

  changeResultView(view: string): void {
    this.currentView = view;
    this.resultViewChange.emit(view);
  }

}
