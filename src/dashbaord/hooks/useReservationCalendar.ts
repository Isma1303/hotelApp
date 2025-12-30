import { useState, useEffect, useCallback } from "react";
import type { EventInput } from "@fullcalendar/core";
import { ReservationHistoryService } from "../service/reservation.service";
import type {
  IReservation,
  IReservationNew,
  IReservationUpdate,
} from "../interfaces/reservation.interface";
import { toast } from "react-toastify";

const reservationService = new ReservationHistoryService();

export interface ReservationEvent extends EventInput {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    reservation: IReservation;
  };
}

export const useReservationCalendar = () => {
  const [events, setEvents] = useState<ReservationEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await reservationService.getAll();
      const calendarEvents: ReservationEvent[] = response.map(
        (reservation) => ({
          id: reservation.reservation_id.toString(),
          title: `Reserva #${reservation.reservation_number} - Habitación #${reservation.room_id}`,
          start: new Date(reservation.check_in),
          end: new Date(reservation.check_out),
          backgroundColor: getStatusColor(reservation.reservation_status_id),
          borderColor: getStatusColor(reservation.reservation_status_id),
          extendedProps: {
            reservation,
          },
        })
      );
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = async (data: IReservationNew) => {
    try {
      await reservationService.create(data);
      await fetchReservations();
      toast.success("Reserva creada exitosamente");
      return true;
    } catch (error) {
      console.error("Error al crear reserva:", error);
      return false;
    }
  };

  const updateReservation = async (id: string, data: IReservationUpdate) => {
    try {
      await reservationService.update(id, data);
      await fetchReservations();
      toast.success("Reserva actualizada exitosamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      return false;
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      // Asumiendo que status_id 3 es "cancelada"
      await reservationService.update(id, { reservation_status_id: 3 });
      await fetchReservations();
      toast.success("Reserva cancelada exitosamente");
      return true;
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      return false;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await reservationService.delete(id);
      await fetchReservations();
      toast.success("Reserva eliminada exitosamente");
      return true;
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      return false;
    }
  };

  return {
    events,
    loading,
    createReservation,
    updateReservation,
    cancelReservation,
    deleteReservation,
    refreshReservations: fetchReservations,
  };
};

// Helper para colores según estado
const getStatusColor = (statusId: number): string => {
  const colors: Record<number, string> = {
    1: "#4CAF50", // Confirmada - Verde
    2: "#FFC107", // Pendiente - Amarillo
    3: "#F44336", // Cancelada - Rojo
    4: "#2196F3", // En proceso - Azul
  };
  return colors[statusId] || "#9E9E9E";
};
