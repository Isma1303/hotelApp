import { Graphs } from '../components/dashboard/graphs/Graphs'
import { KPI } from '../components/dashboard/kpi/kpi'
import { ReservationHistory } from '../components/dashboard/reservations-history/ReservationHistory'

export const Dashboard = () => {
  return (
    <>
      <KPI />
      <Graphs />
      <ReservationHistory />
    </>
  )
}