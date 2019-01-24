import { NgModule } from '@angular/core';
import { MoreDetailDirective } from './more-detail.directive';
import { DisableControlDirective } from './disable-control.directive';

const EXPORTS = [
  MoreDetailDirective,
  DisableControlDirective,
];

@NgModule({
  declarations: [
    ...EXPORTS,
  ],
  exports: [
    ...EXPORTS,
  ],
})
export class SharedDirectiveModule {

}
