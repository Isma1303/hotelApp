export interface IHotel {
  hotel_id: number;
  hotel_name: string;
  address: string;
  city: string;
  country: string;
  image_url: string;
}

export interface INewHotel extends Omit<IHotel, "hotel_id"> {}
export interface IUpdateHotel extends Partial<INewHotel> {}
