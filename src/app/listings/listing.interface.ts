export interface Listing {
    _id?: string;
    title: string;
    description: string;
    image: string;
    price: Number;
    posterUser?: string;
    datePosted: Date;
};
