import { useEffect, useState } from "react";
import { CLGrid } from "../../../../shared";
import { useReservation } from "../../../hooks/useReservationHistory";
import { HotelService } from "../../../service/hotels.service";
import { AuthService } from "../../../../auth/auth.service";
import type { IUser } from "../../../../auth";
import type { IHotel } from "../../../interfaces/hote.interface";

export const ReservationHistory = () => {
    const { fetchLastReservations, loading } = useReservation();
    const [reservations, setReservations] = useState([]);
    const [hotelMap, setHotelMap] = useState<Record<number, string>>({});
    const [userMap, setUserMap] = useState<Record<number, string>>({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const hotelService = new HotelService();
                const hotelsResponse = await hotelService.getAll();
                const hotels = Array.isArray(hotelsResponse) ? hotelsResponse : (hotelsResponse as any)?.data || [];
                const hotelMapping: Record<number, string> = {};
                hotels.forEach((hotel: IHotel) => {
                    hotelMapping[hotel.hotel_id] = hotel.hotel_name;
                });
                setHotelMap(hotelMapping);
            } catch (err) {
                console.error("Error loading hotels:", err);
            }

            try {
                const authService = new AuthService();
                const usersResponse = await authService.getAll();
                const users = Array.isArray(usersResponse) ? usersResponse : (usersResponse as any)?.data || [];
                const userMapping: Record<number, string> = {};
                users.forEach((user: IUser) => {
                    userMapping[user.user_id] = user.user_nm;
                });
                setUserMap(userMapping);
            } catch (err) {
                console.error("Error loading users:", err);
            }

            const data = await fetchLastReservations();
            setReservations(data as any || []);
        };
        loadData();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const renderStatus = (status: string) => {
        const statusConfig: Record<string, { colorVar: string; bgVar: string; icon: string }> = {
            'Confirmada': { colorVar: 'var(--color-success)', bgVar: 'var(--color-success-bg)', icon: 'bi-check-circle-fill' },
            'Pagada': { colorVar: 'var(--color-success)', bgVar: 'var(--color-success-bg)', icon: 'bi-check-circle-fill' },
            'Pendiente': { colorVar: 'var(--color-warning)', bgVar: 'var(--color-warning-bg)', icon: 'bi-clock-fill' },
            'Cancelada': { colorVar: 'var(--color-danger)', bgVar: 'var(--color-danger-bg)', icon: 'bi-x-circle-fill' },
            'Vencida': { colorVar: 'var(--color-danger)', bgVar: 'var(--color-danger-bg)', icon: 'bi-x-circle-fill' },
        };

        const config = statusConfig[status] || { colorVar: 'var(--text-disabled)', bgVar: 'var(--border-light)', icon: 'bi-circle-fill' };

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: config.bgVar,
                    color: config.colorVar,
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '500',
                }}
            >
                <i className={`bi ${config.icon}`} style={{ fontSize: 'var(--font-size-xs)' }}></i>
                {status}
            </span>
        );
    };


    const columnsFields = [
        { field: "reservation_number", header: "Numero de Reserva" },
        { 
            field: "user_id", 
            header: "Cliente",
            body: (rowData: any) => {
                return userMap[rowData.user_id] || `User ${rowData.user_id}`;
            }
        },
        { 
            field: "hotel_id", 
            header: "Hotel",
            body: (rowData: any) => {
                return hotelMap[rowData.hotel_id] || `Hotel ${rowData.hotel_id}`;
            }
        },
        { 
            field: "check_in", 
            header: "Check In",
            body: (rowData: any) => formatDate(rowData.check_in)
        },
        { 
            field: "check_out", 
            header: "Check Out",
            body: (rowData: any) => formatDate(rowData.check_out)
        },
        {
             field: "reservation_status_nm", header: "Estado" ,
             body: (rowData: any) => renderStatus(rowData.reservation_status_nm)
            },
        { 
            field: "total", header: "Total"
        , body: (rowData: any) => `Q${rowData.total}` 
    },
    ];

    return (
        <CLGrid
            gridTitle="Ultimas Reservas"
            data={reservations}
            loading={loading}    
            columns={columnsFields}
            exportable={true}
            exportFilename="Ultimas Reservas"
            scrollable={true}
            scrollHeight="400px"
        />
    );
}