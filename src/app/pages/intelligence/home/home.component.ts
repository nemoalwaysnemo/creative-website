import { Component } from '@angular/core';

@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent {


  onUploaded(test) {
    console.log(2222, test);
  }

}
