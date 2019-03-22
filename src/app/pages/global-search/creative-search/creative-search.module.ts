import { NgModule } from '@angular/core';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeSearchRoutingModule } from './creative-search-routing.module';
import { CreativeGlobalSearchComponent } from './creative-global-search/creative-global-search.component';

@NgModule({
  imports: [
    CreativeSearchRoutingModule,
  ],
  declarations: [
    CreativeSearchComponent,
    CreativeGlobalSearchComponent,
  ],
})
export class CreativeSearchModule {
}
