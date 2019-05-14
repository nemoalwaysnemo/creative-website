import { Component} from '@angular/core';
import { Environment } from '@environment/environment';

@Component({
  selector: 'knowledge-home-page',
  styleUrls: ['./knowledge-home.component.scss'],
  templateUrl: './knowledge-home.component.html',
})
export class KnowledgeHomeComponent {

  backslashUrl: string = Environment.backslashAppUrl;
}
