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
      const reservations = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];

      const calendarEvents: ReservationEvent[] = reservations.map(
        (reservation: IReservation) => {
          const start = new Date(reservation.check_in);
          const end = new Date(reservation.check_out);

          const endInclusive = addOneDay(end);

          const color = getStatusColor(reservation.reservation_status_id);
          const textColor = getStatusTextColor(
            reservation.reservation_status_id
          );
          const statusClass = getStatusClass(reservation.reservation_status_id);

          return {
            id: reservation.reservation_id.toString(),
            title: `Cliente #${reservation.user_id} • Reserva #${reservation.reservation_number}`,
            start,
            end: endInclusive,
            allDay: true,
            display: "block",
            backgroundColor: color,
            borderColor: color,
            textColor,
            classNames: ["reservation-badge", statusClass],
            extendedProps: {
              reservation,
            },
          };
        }
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

const getStatusTextColor = (statusId: number): string => {
  // Mejora de contraste: rojo usa texto blanco, el resto texto oscuro.
  if (statusId === 3) return "#ffffff";
  return "#0f172a";
};

const getStatusClass = (statusId: number): string => {
  const classes: Record<number, string> = {
    1: "reservation-confirmed",
    2: "reservation-pending",
    3: "reservation-cancelled",
    4: "reservation-inprocess",
  };
  return classes[statusId] || "reservation-default";
};

const addOneDay = (date: Date) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
};
