export interface Listing {
  _id?: string;
  title: string;
  description: string;
  image: string;
  price: number;
  posterUser?: string;
  latitude?: number;
  longitude?: number;
  datePosted: Date;
}
