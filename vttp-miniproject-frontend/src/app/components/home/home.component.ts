import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ClinicStore } from '../../clinic.store';
import { Observable, Subscription } from 'rxjs';
import { ClinicService } from '../../services/clinic.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsLoaderService } from '../../services/maps-loader.service';
import { Clinic, Patient } from '../../models';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QueueService } from '../../services/queue.service';
import { Router } from '@angular/router';
import { Stomp } from '@stomp/stompjs';



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private clinicStore = inject(ClinicStore)
  private clinicService = inject(ClinicService);
  private fb = inject(FormBuilder);
  private mapSvc = inject(MapsLoaderService);
  private authSvc = inject(AuthService)
  private queueSvc = inject(QueueService)
  private snackbar= inject(MatSnackBar)
  private router = inject(Router);

  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  protected form!: FormGroup

  protected patient!: Patient

  locations$!: Observable<string[]>
  filteredClinics$!: Observable<Clinic[]>;
  selectedClinic!: Clinic | null

  private notificationSub?: Subscription;
  private connectionSub?: Subscription;
  isConnected = false;


  // Map properties
  mapLoaded = false;
  center: google.maps.LatLngLiteral = { lat: 1.3521, lng: 103.8198 }; // Default to Singapore
  zoom = 12;
  markers: any[] = [];
 
  
  // Map options
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
 

  ngOnInit(): void {
    this.patient = this.authSvc.getPatient()
    this.form=this.createForm()
    this.locations$ = this.clinicService.getClinicLocations()
    this.setupClinicSelectionListener();
    this.filteredClinics$ = this.clinicStore.filteredClinics$;
    this.form.get('location')?.valueChanges.subscribe(location => {
      if (location) {
        this.clinicStore.setSelectedLocation(location);
        this.form.get('clinic')?.setValue(null); // Reset clinic selection when location changes
        
      }
    })
    
    this.initializeMap();
   
  }
    

  protected getFilteredClinics(){
    this.filteredClinics$ = this.clinicStore.filteredClinics$;
    this.form.get('clinic')?.reset();
    this.clearMarkers();
  }

  private setupClinicSelectionListener(): void {
    this.form.get('clinic')?.valueChanges.subscribe(clinicName => {
      if (clinicName) {
        this.filteredClinics$.subscribe(clinics => {
          const selectedClinic = clinics.find(c => c.name === clinicName);
          if (selectedClinic) {
            this.centerOnClinic(selectedClinic);
          }
        });
      }
    });
  }

  private initializeMap(): void {
    this.mapSvc.loadGoogleMapsScript().then(() => {
      this.mapLoaded = true;
    }).catch(err => {
      console.error('Failed to load Google Maps', err);
    });
  }

  private centerOnClinic(clinic: Clinic): void {
    this.selectedClinic = clinic;
    this.center = { lat: clinic.lat, lng: clinic.lon };
    this.zoom = 15;
    this.updateMarker(clinic);
  }

  private updateMarker(clinic: Clinic): void {
    this.markers = [{
      position: { lat: clinic.lat, lng: clinic.lon },
      title: clinic.name,
      options: {
        animation: google.maps.Animation.DROP,
        
      }
    }];
  }

  private clearMarkers(): void {
    this.markers = [];
    this.selectedClinic = null;
  }

  openInfoWindow(marker: MapMarker): void {
    this.infoWindow.open(marker);
  }


  private createForm(): FormGroup {
    return this.form = this.fb.group({
      location: this.fb.control<string>('',[Validators.required]),
      clinic: this.fb.control<string>('', [Validators.required])
    })
  }

  protected processForm() {
    if (this.form.valid && this.selectedClinic) {
      const bookingData = {
        clinicId: this.selectedClinic?.id,
        clinicName: this.selectedClinic?.name,
        userName: this.patient.username,
        userEmail: this.patient.email,
        user_id: this.patient.user_id
      };
  
      this.queueSvc.joinQueue(bookingData)
        .then(confirmBooking => {
          if (confirmBooking) {
            this.queueSvc.setClinicAddress(this.selectedClinic?.address)
            this.queueSvc.setClinicPostalCode(this.selectedClinic?.postalCode)
            this.router.navigate(['/confirmation'])
              
            
          } else {
            this.snackbar.open('Booking failed. Please try again.', 'Close', { duration: 3000 });
          }
        })
        .catch(err => {
          console.error('Booking error:', err);
          this.snackbar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
        });
    } else {
      this.snackbar.open('Please select a location and clinic.', 'Close', { duration: 3000 });
    }
  }

  logout() {
    // Your logout logic here
    this.router.navigate(['/']);
  }

  
}


