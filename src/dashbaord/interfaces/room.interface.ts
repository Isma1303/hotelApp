export interface IRoom {
  room_id: number;
  room_number: string;
  room_type: string;
  price: number;
  is_available: boolean;
  description: string;
  image_url?: string;
  site_url?: string;
  hotel_id: number;
}

export interface IRoomNew extends Omit<IRoom, "room_id"> {}
export interface IRoomUpdate extends Partial<IRoomNew> {}
