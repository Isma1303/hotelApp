import { useState } from "react";
import { ReservationHistoryService } from "../service/reservation.service";
import type { IReservation } from "../interfaces/reservation.interface";

export const useReservationDetail = () => {
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any | null>(null);
  const service = new ReservationHistoryService();

  const fetchReservationDetail = async (reservation_id: number) => {
    setLoading(true);
    try {
      const response = await service.reservationDetail(reservation_id);
      const reservationData = (response as any)?.data;
      setReservation(reservationData as IReservation);
      return reservationData.data;
    } catch (error) {
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
