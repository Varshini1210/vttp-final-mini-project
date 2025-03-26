import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { lastValueFrom, Observable } from "rxjs";
import { BookingConfirmation } from "../models";

  
  @Injectable({
    providedIn: 'root'
  })
  export class QueueService {

    private http = inject(HttpClient)

    bookingConfirmation :BookingConfirmation = {
      clinicId: "",
      clinicName: "",
      userName:"",
      userEmail:"",
      queuePosition:"",
      clinicAddress:"",
      postalCode:0
    }
  
  
    joinQueue(bookingData: any): Promise<BookingConfirmation> {
      return lastValueFrom(this.http.put<{clinicId: string; clinicName: string; userName: string; userEmail: string; queuePosition:string}>('/api/queue/bookings', bookingData))
          .then(response=> {
            this.bookingConfirmation.clinicId = response.clinicId
            this.bookingConfirmation.clinicName = response.clinicName
            this.bookingConfirmation.userName = response.userName
            this.bookingConfirmation.userEmail = response.userEmail
            this.bookingConfirmation.queuePosition = response.queuePosition
            
            return this.bookingConfirmation;
          }).catch( error => {
            console.error("Booking failed: ", error.message)
            throw new Error("Booking failed")
          })
    }
  
    getQueuePosition(clinicId: string, userEmail: string): Observable<number> {
      return this.http.get<number>(`/api/queue/${clinicId}/position`, {
        params: { userEmail }
      });
    }
  
    getNextQueueNumber(clinicId: string): Observable<number> {
      return this.http.get<number>(`/api/queue/${clinicId}/next-number`);
    }
  
    setClinicAddress (address: string | undefined):void{
      this.bookingConfirmation.clinicAddress = address
    }

    setClinicPostalCode (postalCode: number | undefined):void{
      this.bookingConfirmation.postalCode = postalCode
    }

    getClinicBooking() :BookingConfirmation{
      return this.bookingConfirmation
    }
   
  }


  