import { Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'intelligence-folder-view',
  styleUrls: ['../../../../theme/styles/disruption-folder.scss'],
  templateUrl: './intelligence-folder-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntelligenceFolderViewComponent {

  @Input() loading: boolean;

  @Input() document: any;

}
