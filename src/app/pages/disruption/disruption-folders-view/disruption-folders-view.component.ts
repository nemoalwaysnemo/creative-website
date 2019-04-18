import { Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'disruption-folders-view',
  styleUrls: ['./disruption-folders-view.component.scss'],
  templateUrl: './disruption-folders-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisruptionFoldersViewComponent {

  @Input() loading: boolean;

  @Input() document: any;

}
