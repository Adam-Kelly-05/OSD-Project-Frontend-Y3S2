export interface User {
  _id?: string;
  name: string;
  phonenumber: string;
  email: string;
  dob: Date;
  latitude?: number;
  longitude?: number;
  dateJoined?: Date;
  lastUpdated?: Date;
}
