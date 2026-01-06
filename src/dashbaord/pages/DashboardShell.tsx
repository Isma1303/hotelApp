import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, Header } from '../components/dashboard/sidebar-header'
import '../styles/dashboard-layout.css'

export const DashboardShell = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
