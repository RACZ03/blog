import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './shared/home/home.component';
import { ServiciosComponent } from './shared/servicios/servicios.component';
import { BlogComponent } from './shared/blog/blog.component';
import { ContactoComponent } from './shared/contacto/contacto.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServiciosComponent,
    BlogComponent,
    ContactoComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
