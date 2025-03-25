import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom, Observable } from "rxjs";
import { Clinic } from "../models";

@Injectable()
export class ClinicService{

    private http =inject(HttpClient)

    getAllClinics(): Promise<Clinic[]> {
        return lastValueFrom(this.http.get<Clinic[]>('/api/clinics'))
    }

    getClinicLocations(): Observable<string[]> {
        return this.http.get<string[]>('/api/clinics/locations')
    }

    getSectorsByLocation(location: string): Promise<string[]> {
        return lastValueFrom(this.http.get<string[]>(`/api/clinics/${location}`))

    }

}