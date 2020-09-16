import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OptionTagComponent } from './option-tag.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
  ],
  exports: [
    OptionTagComponent,
  ],
  declarations: [
    OptionTagComponent,
  ],
})
export class OptionTagModule {

}
