import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MapaComponent } from './components/mapa/mapa.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule, HttpHandler } from '@angular/common/http';
import { ApiService } from './api.service';

@NgModule({
  declarations: [AppComponent, MapaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    LeafletModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}