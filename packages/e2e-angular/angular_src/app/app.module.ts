import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MorphoModule } from './morpho.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MorphoModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
