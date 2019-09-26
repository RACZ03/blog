import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import{HttpClientModule} from '@angular/common/http';
import{CommonModule} from '@angular/common';

 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './shared/home/home.component';
import { ServiciosComponent } from './shared/servicios/servicios.component';
import { BlogComponent } from './shared/blog/blog.component';
import { ContactoComponent } from './shared/contacto/contacto.component';
import { LoginComponent } from './shared/login/login.component';
import { AdminModule } from './admin/admin.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServiciosComponent,
    BlogComponent,
    ContactoComponent,
    LoginComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    AdminModule,

   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
