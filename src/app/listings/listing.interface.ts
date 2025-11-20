export interface Listing {
    id?: string;
    title: string;
    description: string;
    image: string;
    price: Number;
    // posterPhoneNumber?: User["phonenumber"];
    datePosted: Date;
};