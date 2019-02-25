import { Component } from '@angular/core';
import { NbMenuItem } from 'app/core/nebular/theme';

@Component({
  selector: 'disruption-menu',
  styleUrls: ['./disruption-menu.component.scss'],
  templateUrl: './disruption-menu.component.html',
})

export class DisruptionMenuComponent {
  subMenu: NbMenuItem[] = [
    {
      title: 'DISRUPTION DAYS',
      link: '/p/disruption/disruptiondays',
    },
    {
      title: 'DISRUPTION ROADMAPS',
      link: '/p/disruption/roadmaps',
    },
    {
      title: 'DISRUPTION THEORY',
      link: '/p/disruption/theory',
    },
  ];
}
