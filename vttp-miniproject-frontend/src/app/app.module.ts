import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { provideHttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialModule } from './material/material.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { ClinicService } from './services/clinic.service';
import { provideComponentStore } from '@ngrx/component-store';
import { ClinicStore } from './clinic.store';
import { MapsLoaderService } from './services/maps-loader.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MaterialModule,
    GoogleMapsModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    AuthService,
    provideHttpClient(),
    ClinicService,
    provideComponentStore(ClinicStore),
    MapsLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
