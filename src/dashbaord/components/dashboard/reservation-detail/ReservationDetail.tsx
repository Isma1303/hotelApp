import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReservationDetail } from "../../../hooks/useReservationDetail";
import "./ReservatopmDetail.css";

export const ReservationDetail = () => {
  const { reservation_id } = useParams<{ reservation_id: string }>();
  const navigate = useNavigate();
  const { loading, reservation, fetchReservationDetail } =
    useReservationDetail();

  useEffect(() => {
    const loadData = async () => {
      if (!reservation_id) {
        toast.error("Error al cargar el detalle de la reserva");
        navigate("/dashboard");
        return;
      }

      try {
        const data = await fetchReservationDetail(Number(reservation_id));
        return data;
      } catch (error) {
        toast.error("Error al cargar el detalle de la reserva");
        console.error(error);
      }
    };

    loadData();
  }, [reservation_id]);

  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateNights = (
    checkInRaw: Date | string,
    checkOutRaw: Date | string
  ) => {
    const checkIn = new Date(checkInRaw);
    const checkOut = new Date(checkOutRaw);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const getStatusConfig = (statusId: number) => {
    const statusConfigs: Record<
      number,
      { label: string; colorVar: string; bgVar: string; icon: string }
    > = {
      1: {
        label: "Confirmada",
        colorVar: "var(--color-success)",
        bgVar: "var(--color-success-bg)",
        icon: "bi-check-circle-fill",
      },
      2: {
        label: "Pagada",
        colorVar: "var(--color-success)",
        bgVar: "var(--color-success-bg)",
        icon: "bi-check-circle-fill",
      },
      3: {
        label: "Pendiente",
        colorVar: "var(--color-warning)",
        bgVar: "var(--color-warning-bg)",
        icon: "bi-clock-fill",
      },
      4: {
        label: "Cancelada",
        colorVar: "var(--color-danger)",
        bgVar: "var(--color-danger-bg)",
        icon: "bi-x-circle-fill",
      },
      5: {
        label: "Vencida",
        colorVar: "var(--color-danger)",
        bgVar: "var(--color-danger-bg)",
        icon: "bi-x-circle-fill",
      },
    };
    return (
      statusConfigs[statusId] || {
        label: "Desconocido",
        colorVar: "var(--text-disabled)",
        bgVar: "var(--border-light)",
        icon: "bi-circle-fill",
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="reservation-detail-loading">
        <div className="spinner">
          <i className="bi bi-arrow-clockwise"></i>
        </div>
        <p>Cargando detalle de reserva...</p>
      </div>
    );
  }

  if (
    !reservation ||
    typeof reservation !== "object" ||
    Array.isArray(reservation)
  ) {
    return (
      <div className="reservation-detail-error">
        <i className="bi bi-exclamation-triangle"></i>
        <h2>No se encontró la reserva o el formato es incorrecto</h2>
        <pre
          style={{
            color: "var(--color-danger)",
            background: "var(--bg-tertiary)",
            padding: 16,
            borderRadius: 8,
            maxWidth: 600,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(reservation, null, 2)}
        </pre>
        <button onClick={handleBack} className="btn-back">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const data = reservation.data;
  const statusConfig = getStatusConfig(data.reservation_status_id!);
  const nights = calculateNights(data.check_in, data.check_out);

  return (
    <div className="rd-page">
      <div className="rd-header">
        <button onClick={handleBack} className="rd-back">
          <i className="bi bi-arrow-left"></i>
          Volver
        </button>

        <div className="rd-titleBlock">
          <h1 className="rd-title">Detalle de Reserva</h1>
          <p className="rd-subtitle">
            ID Referencia:{" "}
            <span className="rd-link">#{data.reservation_number}</span>
          </p>
        </div>

        <button className="rd-print" onClick={handlePrint}>
          <i className="bi bi-printer"></i>
          Imprimir Detalle
        </button>
      </div>

      <div className="rd-grid">
        <section className="rd-card rd-statusCard">
          <div className="rd-cardTop">
            <div className="rd-cardTitle">
              <span className="rd-icon rd-icon-blue">
                <i className="bi bi-info-circle"></i>
              </span>
              <h3>Estado de la Reserva</h3>
            </div>

            <div
              className="rd-statusPill"
              style={{
                background: statusConfig.bgVar,
                color: statusConfig.colorVar,
              }}
            >
              <i className={`bi ${statusConfig.icon}`}></i>
              <span>{statusConfig.label.toUpperCase()}</span>
            </div>
          </div>
        </section>

        <section className="rd-card rd-col">
          <div className="rd-cardHead">
            <span className="rd-icon rd-icon-blueSoft">
              <i className="bi bi-person"></i>
            </span>
            <h3>Información del Cliente</h3>
          </div>
          <div className="rd-divider"></div>

          <div className="rd-cardBody">
            <div className="rd-kv">
              <span className="rd-k">NOMBRE DEL CLIENTE</span>
              <span className="rd-v">
                {data.first_name} {data.last_name}
              </span>
            </div>

            <div className="rd-kv rd-kvRow">
              <span className="rd-k">CONTACTO</span>
              <span className="rd-v rd-muted">
                <i className="bi bi-telephone me-2"></i>
                {data.phone || "-"}
              </span>
            </div>
          </div>
        </section>

        <section className="rd-card rd-col">
          <div className="rd-cardHead">
            <span className="rd-icon rd-icon-purpleSoft">
              <i className="bi bi-building"></i>
            </span>
            <h3>Hotel y Habitación</h3>
          </div>
          <div className="rd-divider"></div>

          <div className="rd-cardBody">
            <div className="rd-kv">
              <span className="rd-k">HOTEL</span>
              <span className="rd-v">{data.hotel_name || "-"}</span>
            </div>

            <div className="rd-chipRow">
              <div className="rd-chip">
                <span className="rd-chipK">Habitación</span>
                <span className="rd-chipV">{data.room_number || "-"}</span>
              </div>
              <div className="rd-chip">
                <span className="rd-chipK">Tipo</span>
                <span className="rd-chipV">{data.room_type || "-"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rd-card rd-col">
          <div className="rd-cardHead">
            <span className="rd-icon rd-icon-orangeSoft">
              <i className="bi bi-calendar-event"></i>
            </span>
            <h3>Fechas de Estadía</h3>
          </div>
          <div className="rd-divider"></div>

          <div className="rd-cardBody">
            <div className="rd-dateList">
              <div className="rd-dateRow">
                <div className="rd-dateBox">
                  <span className="rd-dateMonth">
                    {new Date(data.check_in)
                      .toLocaleString("es", { month: "short" })
                      .toUpperCase()}
                  </span>
                  <span className="rd-dateDay">
                    {String(new Date(data.check_in).getDate()).padStart(2, "0")}
                  </span>
                </div>
                <div className="rd-dateInfo">
                  <span className="rd-dateLabel">CHECK-IN</span>
                  <span className="rd-dateValue">
                    {new Date(data.check_in).toLocaleDateString("es", {
                      weekday: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="rd-dateTime">
                    {new Date(data.check_in).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="rd-dateConnector"></div>

              <div className="rd-dateRow">
                <div className="rd-dateBox">
                  <span className="rd-dateMonth">
                    {new Date(data.check_out)
                      .toLocaleString("es", { month: "short" })
                      .toUpperCase()}
                  </span>
                  <span className="rd-dateDay">
                    {String(new Date(data.check_out).getDate()).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>
                <div className="rd-dateInfo">
                  <span className="rd-dateLabel">CHECK-OUT</span>
                  <span className="rd-dateValue">
                    {new Date(data.check_out).toLocaleDateString("es", {
                      weekday: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="rd-dateTime">
                    {new Date(data.check_out).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="rd-nightsPill">
                <i className="bi bi-moon"></i>
                <span>
                  {nights} {nights === 1 ? "Noche" : "Noches"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rd-card rd-paymentCard">
          <div className="rd-cardHead">
            <span className="rd-icon rd-icon-pinkSoft">
              <i className="bi bi-credit-card"></i>
            </span>
            <h3>Información de Pago</h3>
          </div>
          <div className="rd-divider"></div>

          <div className="rd-paymentBody">
            <div className="rd-payLeft">
              <div className="rd-payMethod">
                <div className="rd-payMethodIcon">
                  <i className="bi bi-cash-coin"></i>
                </div>
                <div>
                  <div className="rd-k">Método de Pago</div>
                  <div className="rd-v">
                    {(data.payment_method_nm || "—").toUpperCase()}
                  </div>
                </div>
              </div>

              <p className="rd-payNote">
                El pago se ha registrado correctamente en el sistema. Para
                cualquier aclaración, utilice el ID de referencia #
                {data.reservation_number}.
              </p>
            </div>

            <div className="rd-payRight">
              <div className="rd-payRow">
                <span>Precio por noche</span>
                <strong>
                  Q
                  {nights > 0
                    ? (Number(data.total) / nights).toFixed(2)
                    : "0.00"}
                </strong>
              </div>
              <div className="rd-payRow">
                <span>Número de noches</span>
                <strong>x{nights}</strong>
              </div>
              <div className="rd-payRow">
                <span>Impuestos y Servicios</span>
                <strong className="rd-green">Incluido</strong>
              </div>

              <div className="rd-payTotal">
                <span>Total Pagado</span>
                <span className="rd-totalAmount">
                  Q{Number(data.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="rd-bottomAccent"></div>
        </section>
      </div>
    </div>
  );
};
