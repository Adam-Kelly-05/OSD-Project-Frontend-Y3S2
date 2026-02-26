export interface User {
  _id?: string;
  name: string;
  phonenumber: string;
  email: string;
  profilePicture?: string;
  dob: Date;
  latitude?: number;
  longitude?: number;
  dateJoined?: Date;
  lastUpdated?: Date;
  role?: string;
}
