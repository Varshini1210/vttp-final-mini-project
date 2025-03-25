import { Component, inject, OnInit } from '@angular/core';
import { ClinicStore } from '../../clinic.store';
import { Observable } from 'rxjs';
import { ClinicService } from '../../services/clinic.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsLoaderService } from '../../services/maps-loader.service';
import { Clinic } from '../../models';

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

  protected username: string|null = "" 
  protected form!: FormGroup

  locations$!: Observable<string[]>
  filteredClinics$!: Observable<Clinic[]>;
 

  ngOnInit(): void {
    this.username = localStorage.getItem("username")
    this.form=this.createForm()
    this.locations$ = this.clinicService.getClinicLocations()
    // this.filteredClinics$ = this.clinicStore.filteredClinics$;
    this.form.get('location')?.valueChanges.subscribe(location => {
      if (location) {
        this.clinicStore.setSelectedLocation(location);
        this.form.get('clinic')?.setValue(null); // Reset clinic selection when location changes
        
      }
    })
    this.mapSvc.loadGoogleMapsScript();
  }

  protected getFilteredClinics(){
    this.filteredClinics$ = this.clinicStore.filteredClinics$;
  }

  private createForm(): FormGroup {
    return this.form = this.fb.group({
      location: this.fb.control<string>('',[Validators.required]),
      clinic: this.fb.control<string>('', [Validators.required])
    })
  }
}


