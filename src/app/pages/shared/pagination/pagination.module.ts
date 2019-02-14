import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';


const COMPONENTS = [PaginationComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS],
  exports: [
    ...COMPONENTS,
  ],
})
export class PaginationModule {

}
