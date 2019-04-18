import { Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'intelligence-folders-view',
  styleUrls: ['./intelligence-folders-view.component.scss'],
  templateUrl: './intelligence-folders-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntelligenceFoldersViewComponent {

  @Input() loading: boolean;

  @Input() document: any;

}
