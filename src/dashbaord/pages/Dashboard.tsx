import { useState } from 'react';
import { Graphs } from '../components/dashboard/graphs/Graphs';
import { KPI } from '../components/dashboard/kpi/kpi';
import { ReservationHistory } from '../components/dashboard/reservations-history/ReservationHistory';
import { Sidebar, Header } from '../components/dashboard/sidebar-header';
import '../styles/dashboard-layout.css';

export const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`dashboard-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          <div className="container-fluid">
            <KPI />
            <Graphs/>
            <ReservationHistory/>
            
          </div>
        </main>
      </div>
    </div>
  );
};