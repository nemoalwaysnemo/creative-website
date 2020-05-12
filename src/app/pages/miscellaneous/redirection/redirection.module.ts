import { NgModule } from '@angular/core';
import { RedirectionComponent } from './redirection.component';
import { RedirectionRoutingModule } from './redirection.routing.module';

@NgModule({
  imports: [
    RedirectionRoutingModule,
  ],
  declarations: [
    RedirectionComponent,
  ],
})
export class RedirectionModule { }
