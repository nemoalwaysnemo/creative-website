import { Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'disruption-folders-view',
  styleUrls: ['./disruption-folders-view.component.scss'],
  templateUrl: './disruption-folders-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisruptionFoldersViewComponent {
  @Input() document: any;
  @Input() folderContents: any;
  loading: boolean = true;
  getThumbnailUrl(doc): string {
    return doc.isAudio() && doc.type === 'App-Library-Audio' ? 'assets/images/no-thumbnail.png' : doc.thumbnailUrl;
  }

}
