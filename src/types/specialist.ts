export interface Specialist {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  experience: number;
  description: string;
  avatar: string;
  distance: number;
  eta: number;
  price: string;
  available: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export type AppState = 'address' | 'searching' | 'specialists' | 'tracking';
