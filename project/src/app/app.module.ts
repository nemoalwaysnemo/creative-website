import { APP_INITIALIZER, NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { ThemeModule } from '@theme/theme.module';
import { AppEnvService } from '@core/services/app-env.service';
import { DocumentFormModule } from './pages/shared/document-form/document-form.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    DocumentFormModule,
    ThemeModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: APP_INITIALIZER,
      useFactory: (envService: AppEnvService) => () => envService.init(),
      deps: [AppEnvService],
      multi: true,
    },
  ],
})
export class AppModule {

}
