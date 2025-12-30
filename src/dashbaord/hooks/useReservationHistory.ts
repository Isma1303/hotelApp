import { useState } from "react";
import { ReservationHistoryService } from "../service/reservation.service";

export const useReservation = () => {
  const reservationService = new ReservationHistoryService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLastReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.getLastReservation();
      return response.data;
    } catch (err: any) {
      setError(err.message || "Error fetching reservation history");
      return [];
    } finally {
      setLoading(false);
    }
  };
  return { fetchLastReservations, loading, error };
};
