import { parentService } from "../../shared";
import type {
  IReservation,
  IReservationNew,
  IReservationUpdate,
} from "../interfaces/reservation.interface";
import type {
  IReservationStatus,
  IReservationStatusNew,
  IReservationStatusUpdate,
} from "../interfaces/reservation_status.interface";

export class ReservationHistoryService extends parentService<
  IReservation,
  IReservationNew,
  IReservationUpdate
> {
  constructor() {
    super("reservation");
  }

  getLastReservation() {
    return this.http.get<any[]>(`/last-reservations`);
  }
}

export class ReservationStatusService extends parentService<
  IReservationStatus,
  IReservationStatusNew,
  IReservationStatusUpdate
> {
  constructor() {
    super("reservation-status");
  }
}
