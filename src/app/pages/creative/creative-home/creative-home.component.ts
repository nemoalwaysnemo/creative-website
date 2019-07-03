import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { NbLayoutScrollService } from '@core/nebular/theme/services/scroll.service.ts';
import { debounce } from './debounce';

@Component({
  selector: 'creative-home-page',
  styleUrls: ['./creative-home.component.scss'],
  templateUrl: './creative-home.component.html',
})
export class CreativeHomeComponent implements OnInit, OnDestroy {

  private destination: number = 0;

  headline: string = 'This is how we kill boring.';

  subHead: string = 'Our entire collection of disruptive work is all right here.';

  placeholder: string = 'Search for campaigns by title, agency, brand, client...';

  private subscription: Subscription = new Subscription();

  scrollToglle: boolean = true;

  params: any = {
    pageSize: 10,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH + 'TBWA-',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(private scrollService: NbLayoutScrollService) { }
  @HostListener('mousewheel', ['$event'])
  @debounce()
  scroll(event: MouseEvent) {
    const delta = event['deltaY'];
    if (this.scrollToglle) {
      if (delta > 0 && this.destination < 3) {
        this.destination = this.destination + 1;
      } else if (delta < 0 && this.destination > 0) {
        this.destination = this.destination - 1;
      }
      this.scrollToSection(this.destination);
    }
  }

  ngOnInit() {
    this.scrollService.onSectionScroll()
      .subscribe((res) => {
        this.scrollToglle = res.tag;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private scrollToSection(destination) {
    if (destination === 2 || destination === 3) {
      this.scrollService.triggerScrollTo('destination-' + destination, -150);
    } else {
      this.scrollService.triggerScrollTo('destination-' + destination);
    }
  }
}
