import { NgModule } from '@angular/core';
import { MoreDetailDirective } from './more-detail.directive';

const EXPORTS = [
  MoreDetailDirective,
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
