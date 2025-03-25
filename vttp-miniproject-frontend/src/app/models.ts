export interface Clinic {
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