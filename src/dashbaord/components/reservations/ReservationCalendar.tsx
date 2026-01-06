import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg, EventDropArg } from "@fullcalendar/core";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useReservationCalendar } from "../../hooks/useReservationCalendar";
import { ReservationDialog } from "./ReservationDialog";
import type { IReservation } from "../../interfaces/reservation.interface";
import "./ReservationCalendar.css";
import esLocale from "@fullcalendar/core/locales/es";

export const ReservationCalendar = () => {
  const {
    events,
    loading,
    createReservation,
    updateReservation,
  } = useReservationCalendar();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const calendarRef = useRef<FullCalendar>(null);


  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start);
    setSelectedReservation(null);
    setDialogVisible(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const reservation = clickInfo.event.extendedProps.reservation as IReservation;
    setSelectedReservation(reservation);
    setSelectedDate(undefined);
    setDialogVisible(true);
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const reservation = dropInfo.event.extendedProps.reservation as IReservation;
    
    confirmDialog({
      message: "¿Desea actualizar las fechas de esta reserva?",
      header: "Confirmar cambio",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: async () => {
        const success = await updateReservation(
          reservation.reservation_id.toString(),
          {
            check_in: dropInfo.event.start!,
            check_out: dropInfo.event.end!,
          }
        );
        if (!success) {
          dropInfo.revert();
        }
      },
      reject: () => {
        dropInfo.revert();
      },
    });
  };

  const handleNewReservation = () => {
    setSelectedReservation(null);
    setSelectedDate(new Date());
    setDialogVisible(true);
  };

  const handleSaveReservation = async (data: any) => {
    if (selectedReservation) {
      return await updateReservation(
        selectedReservation.reservation_id.toString(),
        data
      );
    } else {
      return await createReservation(data);
    }
  };

  return (
    <div className="reservation-calendar-container">
      <ConfirmDialog />
      
      <div className="reservation-calendar-header">
        <div className="reservation-calendar-heading">
          <h2>Calendario de Reservas</h2>
          <p className="reservation-calendar-subtitle">Gestiona la disponibilidad y ocupación del hotel.</p>
        </div>
        <Button
          label="Nueva Reserva"
          icon="pi pi-plus"
          onClick={handleNewReservation}
          className="new-reservation-btn"
        />
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#4CAF50" }}></div>
          <span>Confirmada</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#FFC107" }}></div>
          <span>Pendiente</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#F44336" }}></div>
          <span>Cancelada</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: "#2196F3" }}></div>
          <span>En proceso</span>
        </div>
      </div>

      <div className={loading ? "calendar-loading" : ""}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          eventContent={(eventInfo) => (
            <div style={{ padding: "2px 4px" }}>
              <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                {eventInfo.event.title}
              </div>
              <div style={{ fontSize: "0.75rem" }}>
                ${eventInfo.event.extendedProps.reservation.price}
              </div>
            </div>
          )}
        />
      </div>

      <ReservationDialog
        visible={dialogVisible}
        reservation={selectedReservation}
        selectedDate={selectedDate}
        onHide={() => setDialogVisible(false)}
        onSave={handleSaveReservation}
      />
    </div>
  );
};
