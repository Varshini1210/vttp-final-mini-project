import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsLoaderService {
 

  loadGoogleMapsScript(): void {
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }
  // script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;

  constructor() { }
}
