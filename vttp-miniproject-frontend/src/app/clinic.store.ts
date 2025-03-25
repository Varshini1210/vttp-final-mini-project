import { inject, Injectable } from "@angular/core";
import { Clinic, ClinicSlice } from "./models";
import { ComponentStore, OnStoreInit } from "@ngrx/component-store";
import { ClinicService } from "./services/clinic.service";
import { BehaviorSubject, Observable } from "rxjs";

const INIT_STATE: ClinicSlice ={
    clinics: [],
    selectedLocation: null
}

@Injectable({
    providedIn: 'root',
})
export class ClinicStore extends ComponentStore<ClinicSlice> implements OnStoreInit {

    private clinicService = inject(ClinicService);

    constructor(){
        super(INIT_STATE)
    }

    ngrxOnStoreInit(): void {
        this.clinicService.getAllClinics()
            .then(clinics => {
            console.log('Fetched clinics:', clinics); // Log the clinics
            this.setState({clinics, selectedLocation: null});
            });
    }

    // Holds the sectors for the selected location
    private readonly sectors$ = new BehaviorSubject<string[]>([]);

    // Sets the selected location and retrieves corresponding sectors
    readonly setSelectedLocation = this.updater((state, location: string) => {
        this.fetchSectorsForLocation(location);
        return { ...state, selectedLocation: location };
    });

    // Fetch sectors based on the selected location
    private fetchSectorsForLocation(location: string) {
        this.clinicService.getSectorsByLocation(location)
            .then(sectors => {
            console.log('Fetched sectors for location:', location, sectors); // Log the sectors
            this.sectors$.next(sectors);
            });
    }

    // Computed observable to get filtered clinics
    readonly filteredClinics$: Observable<Clinic[]> = this.select(
        this.state$,
        this.sectors$,
        (state, sectors) => {
            const filteredClinics = state.clinics
            .filter(clinic => sectors.some(sector => clinic.postalCode.toString().startsWith(sector)))
            // .map(clinic => clinic.name); // Extract only clinic names
            
            console.log('Filtered Clinics:', filteredClinics); // Log the filtered clinics

            return filteredClinics;
        }
    )

    
}