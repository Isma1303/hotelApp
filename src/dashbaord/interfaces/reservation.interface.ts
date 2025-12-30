export interface IReservation {
  reservation_id: number;
  reservation_number: string;
  user_id: number;
  hotel_id: number;
  room_id: number;
  check_in: Date;
  check_out: Date;
  reservation_status_id: number;
  total: number;
}

export interface IReservationNew extends Omit<IReservation, "reservation_id"> {}
export interface IReservationUpdate extends Partial<IReservation> {}
