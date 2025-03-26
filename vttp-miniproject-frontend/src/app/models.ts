export interface Clinic {
    id: number
    name: string
    lat: number
    lon: number
    postalCode: number
    address: string
  }

  export interface ClinicSlice {
    clinics: Clinic[]
    selectedLocation: string | null
  }

  export interface Patient {
    username: string
    email: string
    user_id: string
    bookingStatus: boolean
  }

  export interface BookingConfirmation {
    clinicId: string;
    clinicName: string;
    userName: string;
    userEmail: string;
    queuePosition: string;
    clinicAddress?: string;
    postalCode?: number;
  }
  

