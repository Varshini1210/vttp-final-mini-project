import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
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
import { QueueConfirmationComponent } from './components/queue-confirmation/queue-confirmation.component';
import { QueueService } from './services/queue.service';
import { WebSocketService } from './services/web-socket.service';

const firebaseConfig = {
  apiKey: "AIzaSyA2vzQMVUWSaXK4XJKpyKf7_nJL200ZMnE",
      authDomain: "vttp-miniproject.firebaseapp.com",
      projectId: "vttp-miniproject",
      storageBucket: "vttp-miniproject.firebasestorage.app",
      messagingSenderId: "628625146359",
      appId: "1:628625146359:web:7aecd5fce5b0d34b1b2ef2",
      measurementId: "G-4G93VKGE7D"
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminHomeComponent,
    QueueConfirmationComponent
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
    GoogleMapsModule,
    AngularFireMessagingModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    AuthService,
    provideHttpClient(),
    ClinicService,
    provideComponentStore(ClinicStore),
    MapsLoaderService,
    QueueService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
