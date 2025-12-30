import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import type { IReservation, IReservationNew, IReservationUpdate } from "../../interfaces/reservation.interface";
import { ReservationStatusService } from "../../service/reservation.service";

interface ReservationDialogProps {
  visible: boolean;
  reservation?: IReservation | null;
  selectedDate?: Date;
  onHide: () => void;
  onSave: (data: IReservationNew | IReservationUpdate) => Promise<boolean>;
}

const reservationStatusService = new ReservationStatusService();

export const ReservationDialog: React.FC<ReservationDialogProps> = ({
  visible,
  reservation,
  selectedDate,
  onHide,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    user_id: 0,
    hotel_id: 0,
    room_id: 0,
    check_in: new Date(),
    check_out: new Date(),
    reservation_status_id: 1,
    total: 0,
    reservation_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState<Array<{ label: string; value: number }>>([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await reservationStatusService.getAll();
        
        const statuses = (response as any).data 
        
        if (Array.isArray(statuses)) {
          const mappedStatuses = statuses.map(status => ({
            label: status.reservation_status_nm,
            value: status.reservation_status_id,
          }));
          setStatusOptions(mappedStatuses);
        } else {
          console.error("La respuesta no contiene un array:", response);
          setStatusOptions([]);
        }
      } catch (error) {
        console.error("Error al cargar estados de reserva:", error);
        setStatusOptions([]);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
    if (reservation) {
              setFormData({
        user_id: reservation.user_id,
        hotel_id: reservation.hotel_id,
        room_id: reservation.room_id,
        check_in: new Date(reservation.check_in),
        check_out: new Date(reservation.check_out),
        reservation_status_id: reservation.reservation_status_id,
        total: reservation.total,
        reservation_number: reservation.reservation_number,
      });
    } else if (selectedDate) {
      const checkOut = new Date(selectedDate);
      checkOut.setDate(checkOut.getDate() + 1);
      setFormData({
        ...formData,
        check_in: selectedDate,
        check_out: checkOut,
        reservation_number: Math.floor(Math.random() * 100000).toString(),
      });
    } else {
      resetForm();
    }
  }, [reservation, selectedDate, visible]);

  const resetForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData({
      user_id: 0,
      hotel_id: 0,
      room_id: 0,
      check_in: new Date(),
      check_out: tomorrow,
      reservation_status_id: 1,
      total: 0,
      reservation_number: Math.floor(Math.random() * 100000).toString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (reservation) {
        const success = await onSave({
          ...formData,
        });
        if (success) {
          onHide();
          resetForm();
        }
      } else {
        const success = await onSave(formData);
        if (success) {
          onHide();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => {
          onHide();
          resetForm();
        }}
        className="p-button-text"
        disabled={loading}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "600px" }}
      header={reservation ? "Editar Reserva" : "Nueva Reserva"}
      modal
      className="p-fluid"
      footer={dialogFooter}
      onHide={() => {
        onHide();
        resetForm();
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reservation_number" className="form-label">
            Número de Reserva
          </label>
          <InputText
            id="reservation_number"
            value={formData.reservation_number}
            onChange={(e) =>
              setFormData({ ...formData, reservation_number: e.target.value })
            }
            disabled={!!reservation}
            className="w-100"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="user_id" className="form-label">
            ID Usuario
          </label>
          <InputNumber
            id="user_id"
            value={formData.user_id}
            onValueChange={(e) =>
              setFormData({ ...formData, user_id: e.value || 0 })
            }
            className="w-100"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hotel_id" className="form-label">
            ID Hotel
          </label>
          <InputNumber
            id="hotel_id"
            value={formData.hotel_id}
            onValueChange={(e) =>
              setFormData({ ...formData, hotel_id: e.value || 0 })
            }
            className="w-100"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="room_id" className="form-label">
            ID Habitación
          </label>
          <InputNumber
            id="room_id"
            value={formData.room_id}
            onValueChange={(e) =>
              setFormData({ ...formData, room_id: e.value || 0 })
            }
            className="w-100"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="check_in" className="form-label">
            Fecha Check-in
          </label>
          <Calendar
            id="check_in"
            value={formData.check_in}
            onChange={(e) =>
              setFormData({ ...formData, check_in: e.value as Date })
            }
            showIcon
            dateFormat="dd/mm/yy"
            className="w-100"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="check_out" className="form-label">
            Fecha Check-out
          </label>
          <Calendar
            id="check_out"
            value={formData.check_out}
            onChange={(e) =>
              setFormData({ ...formData, check_out: e.value as Date })
            }
            showIcon
            dateFormat="dd/mm/yy"
            minDate={formData.check_in}
            className="w-100"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Estado
          </label>
          <Dropdown
            id="status"
            value={formData.reservation_status_id}
            options={statusOptions}
            onChange={(e) =>
              setFormData({ ...formData, reservation_status_id: e.value })
            }
            placeholder="Seleccione un estado"
            className="w-100"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="total" className="form-label">
            Precio
          </label>
          <InputNumber
            id="total"
            value={formData.total}
            onValueChange={(e) =>
              setFormData({ ...formData, total: e.value || 0 })
            }
            mode="currency"
            currency="GTQ"
            locale="es-GT"
            className="w-100"
            required
          />
        </div>
      </form>
    </Dialog>
  );
};
