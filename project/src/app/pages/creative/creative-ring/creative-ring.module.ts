import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeRingPageComponent } from './creative-ring.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
  ],
  declarations: [
    CreativeRingPageComponent,
  ],
})
export class CreativeRingModule { }
