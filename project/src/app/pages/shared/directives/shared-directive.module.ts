import { NgModule } from '@angular/core';
import { DisableControlDirective } from './disable-control.directive';

const EXPORTS = [
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
