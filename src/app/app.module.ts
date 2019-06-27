import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '@core/core.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ThemeModule } from '@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsModule } from '@core/google-analytics';
import { CacheService } from '@core/services';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    GoogleAnalyticsModule.forRoot(),
    DeviceDetectorModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    CacheService,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
