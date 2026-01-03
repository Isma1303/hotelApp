import { useState } from "react";
import { ReservationHistoryService } from "../service/reservation.service";
import type { IReservation } from "../interfaces/reservation.interface";

export const useReservationDetail = () => {
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<IReservation | null>(null);

  const fetchReservationDetail = async (reservation_id: number) => {
    setLoading(true);
    try {
      const service = new ReservationHistoryService();
      const response = await service.reservationDetail(reservation_id);
      // Guardar solo el campo data en el estado
      const reservationData = (response as any)?.data;
      console.log("Reservation data received:", reservationData);
      setReservation(reservationData as IReservation);
      return reservationData;
    } catch (error) {
      console.error("Error fetching reservation detail:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reservation,
    fetchReservationDetail,
  };
};
