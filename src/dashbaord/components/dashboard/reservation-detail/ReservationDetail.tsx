import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReservationDetail } from "../../../hooks/useReservationDetail";
import "./ReservatopmDetail.css";

export const ReservationDetail = () => {
    const { reservation_id } = useParams<{ reservation_id: string }>();
    const navigate = useNavigate();
    const { loading, reservation, fetchReservationDetail } = useReservationDetail();

    useEffect(() => {
        const loadData = async () => {
            if (!reservation_id) {
                toast.error("ID de reserva no válido");
                navigate("/dashboard");
                return;
            }

            try {
                await fetchReservationDetail(parseInt(reservation_id));
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

    const calculateNights = () => {
        if (!reservation) return 0;
        const checkIn = new Date(reservation.check_in);
        const checkOut = new Date(reservation.check_out);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1; 
    };

    const getStatusConfig = (statusId: number) => {
        const statusConfigs: Record<number, { label: string; colorVar: string; bgVar: string; icon: string }> = {
            1: { label: 'Confirmada', colorVar: 'var(--color-success)', bgVar: 'var(--color-success-bg)', icon: 'bi-check-circle-fill' },
            2: { label: 'Pagada', colorVar: 'var(--color-success)', bgVar: 'var(--color-success-bg)', icon: 'bi-check-circle-fill' },
            3: { label: 'Pendiente', colorVar: 'var(--color-warning)', bgVar: 'var(--color-warning-bg)', icon: 'bi-clock-fill' },
            4: { label: 'Cancelada', colorVar: 'var(--color-danger)', bgVar: 'var(--color-danger-bg)', icon: 'bi-x-circle-fill' },
            5: { label: 'Vencida', colorVar: 'var(--color-danger)', bgVar: 'var(--color-danger-bg)', icon: 'bi-x-circle-fill' },
        };
        return statusConfigs[statusId] || { label: 'Desconocido', colorVar: 'var(--text-disabled)', bgVar: 'var(--border-light)', icon: 'bi-circle-fill' };
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

    // Si reservation es null o no es un objeto plano, mostrar advertencia
    if (!reservation || typeof reservation !== 'object' || Array.isArray(reservation)) {
        return (
            <div className="reservation-detail-error">
                <i className="bi bi-exclamation-triangle"></i>
                <h2>No se encontró la reserva o el formato es incorrecto</h2>
                <pre style={{color: 'var(--color-danger)', background: 'var(--bg-tertiary)', padding: 16, borderRadius: 8, maxWidth: 600, overflowX: 'auto'}}>
                  {JSON.stringify(reservation, null, 2)}
                </pre>
                <button onClick={handleBack} className="btn-back">
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    // Si por error el objeto tiene un campo data, usar ese campo
    const data = (reservation as any).data ? (reservation as any).data : reservation;
    const statusConfig = getStatusConfig(data.reservation_status_id);
    const nights = calculateNights();

    console.log("Rendering reservation:", data);
    console.log("Nights:", nights);
    console.log("Status config:", statusConfig);

    return (
        <div className="reservation-detail-container">
            <div className="reservation-detail-header">
                <button onClick={handleBack} className="btn-back">
                    <i className="bi bi-arrow-left"></i>
                    Volver
                </button>
                <h1 className="reservation-detail-title">
                    Detalle de Reserva #{reservation.reservation_number}
                </h1>
                <button onClick={handlePrint} className="btn-print">
                    <i className="bi bi-printer"></i>
                    Imprimir
                </button>
            </div>

            <div className="reservation-detail-content">
                {/* Status Card */}
                <div className="detail-card status-card">
                    <div className="card-header">
                        <i className="bi bi-info-circle"></i>
                        <h3>Estado de la Reserva</h3>
                    </div>
                    <div className="card-body">
                        <div
                            className="status-badge-large"
                            style={{
                                backgroundColor: statusConfig.bgVar,
                                color: statusConfig.colorVar,
                            }}
                        >
                            <i className={`bi ${statusConfig.icon}`}></i>
                            <span>{statusConfig.label}</span>
                        </div>
                        <div className="status-info">
                            <div className="info-item">
                                <span className="info-label">Número de Reserva:</span>
                                <span className="info-value">{reservation.reservation_number}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="detail-card">
                    <div className="card-header">
                        <i className="bi bi-person"></i>
                        <h3>Información del Cliente</h3>
                    </div>
                    <div className="card-body">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">
                                    <i className="bi bi-hash"></i>
                                    ID Cliente:
                                </span>
                                <span className="info-value">{reservation.user_id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hotel and Room Info */}
                <div className="detail-card">
                    <div className="card-header">
                        <i className="bi bi-building"></i>
                        <h3>Información del Hotel y Habitación</h3>
                    </div>
                    <div className="card-body">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">
                                    <i className="bi bi-hash"></i>
                                    ID Hotel:
                                </span>
                                <span className="info-value">{reservation.hotel_id}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">
                                    <i className="bi bi-door-closed"></i>
                                    Habitación:
                                </span>
                                <span className="info-value">
                                    {reservation.room_number || `Habitación ${reservation.room_id}`}
                                </span>
                            </div>
                            {reservation.room_type && (
                                <div className="info-item">
                                    <span className="info-label">
                                        <i className="bi bi-tag"></i>
                                        Tipo de Habitación:
                                    </span>
                                    <span className="info-value">{reservation.room_type}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dates Info */}
                <div className="detail-card">
                    <div className="card-header">
                        <i className="bi bi-calendar-range"></i>
                        <h3>Fechas de Estadía</h3>
                    </div>
                    <div className="card-body">
                        <div className="dates-container">
                            <div className="date-box">
                                <i className="bi bi-calendar-check"></i>
                                <div className="date-info">
                                    <span className="date-label">Check-in</span>
                                    <span className="date-value">{formatDate(reservation.check_in)}</span>
                                </div>
                            </div>
                            <div className="date-separator">
                                <i className="bi bi-arrow-right"></i>
                                <span className="nights-badge">{nights} {nights === 1 ? 'noche' : 'noches'}</span>
                            </div>
                            <div className="date-box">
                                <i className="bi bi-calendar-x"></i>
                                <div className="date-info">
                                    <span className="date-label">Check-out</span>
                                    <span className="date-value">{formatDate(reservation.check_out)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="detail-card payment-card">
                    <div className="card-header">
                        <i className="bi bi-cash-coin"></i>
                        <h3>Información de Pago</h3>
                    </div>
                    <div className="card-body">
                        <div className="payment-summary">
                            {reservation.payment_method_nm && (
                                <div className="payment-row">
                                    <span className="payment-label">
                                        <i className="bi bi-credit-card"></i>
                                        Método de Pago:
                                    </span>
                                    <span className="payment-value">{reservation.payment_method_nm}</span>
                                </div>
                            )}
                            <div className="payment-row">
                                <span className="payment-label">Precio por noche:</span>
                                <span className="payment-value">
                                    Q{nights > 0 ? (Number(reservation.total) / nights).toFixed(2) : '0.00'}
                                </span>
                            </div>
                            <div className="payment-row">
                                <span className="payment-label">Número de noches:</span>
                                <span className="payment-value">{nights}</span>
                            </div>
                            <div className="payment-row payment-total">
                                <span className="payment-label">Total:</span>
                                <span className="payment-value">Q{Number(reservation.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="reservation-detail-actions">
                <button className="btn-secondary" onClick={handleBack}>
                    <i className="bi bi-x-circle"></i>
                    Cerrar
                </button>
                <button className="btn-primary" onClick={handlePrint}>
                    <i className="bi bi-printer"></i>
                    Imprimir Detalle
                </button>
            </div>
        </div>
    );
};