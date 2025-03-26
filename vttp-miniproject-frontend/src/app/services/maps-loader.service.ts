import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsLoaderService {
 
  private readonly apiKey = environment.googleMapsApiKey
  private loaded = false;

  constructor() {}

  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loaded || typeof google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.loaded = true;
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
}
