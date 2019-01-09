import { Component, Input } from '@angular/core';
import { ListViewSettings, ListViewItem } from './list-view.interface';
import { deepExtend } from '@core/services';

@Component({
  selector: 'tbwa-list-view',
  styleUrls: ['./list-view.component.scss'],
  templateUrl: './list-view.component.html',
})
export class ListViewComponent {

  options: any = {};

  @Input() layout: string;

  @Input() documents: ListViewItem[];

  @Input()
  set settings(opts: any) {
    if (opts) {
      this.options = ListViewSettings.OptionsFactory(opts);
    }
  }


}
