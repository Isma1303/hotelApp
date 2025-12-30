export interface IReservationStatus {
  reservation_status_id: number;
  reservation_status_nm: string;
  icon: string;
}

export interface IReservationStatusNew
  extends Omit<IReservationStatus, "reservation_status_id"> {}
export interface IReservationStatusUpdate
  extends Partial<Omit<IReservationStatus, "reservation_status_id">> {}
