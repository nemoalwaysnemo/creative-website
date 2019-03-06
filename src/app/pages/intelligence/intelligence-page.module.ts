import { NgModule } from '@angular/core';
import { HomePageModule } from './home/home.module';
import { IntelligencePageComponent } from './intelligence-page.component';
import { IntelligencePageRoutingModule } from './intelligence-page-routing.module';


@NgModule({
  imports: [
    HomePageModule,
    IntelligencePageRoutingModule,
  ],
  declarations: [
    IntelligencePageComponent,
  ],
})
export class IntelligencePageModule {
}
