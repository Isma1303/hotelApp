import { useEffect } from 'react';
import { useKpiValues } from '../../../hooks/useKpiValues';
import './kpi.css';

interface KPIItem {
  icon: string;
  label: string;
  value: string | number;
  change: number;
  color: 'primary' | 'success' | 'info' | 'warning';
}

export const KPI = () => {
  const {fetchKpiValues, kpiValues} = useKpiValues();

  useEffect(()=>{
    fetchKpiValues();
  },[]);

  const kpis: KPIItem[] = [
    {
      icon: 'bi-calendar-check',
      label: 'Reservaciones',
      value: kpiValues?.data?.reservationsCount || '0',
      change: 0,
      color: 'primary'
    },
    {
      icon: 'bi-door-open',
      label: 'Ocupación',
      value: kpiValues?.data?.ocupationCount || '0',
      change: 0,
      color: 'success'
    },
    {
      icon: 'bi-cash-stack',
      label: 'Resumen del Mes',
      value: `$${kpiValues?.data?.monthSummary || '0'}`,
      change: 0,
      color: 'info'
    },
    {
      icon: 'bi-file-earmark-text',
      label: 'Facturas Pendientes',
      value: kpiValues?.data?.pendingInvoices || '0',
      change: 0,
      color: 'warning'
    }
  ];


  return (
    <div className="kpi-grid">
      {kpis.map((kpi, index) => (
        <div key={index} className={`kpi-card kpi-${kpi.color}`}>
          <div className="kpi-header">
            <h4 className="kpi-label">{kpi.label}</h4>
            <div className="kpi-icon">
              <i className={`bi ${kpi.icon}`}></i>
            </div>
          </div>

          <div className="kpi-body">
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-change ${kpi.change >= 0 ? 'positive' : 'negative'}`}>
              <i className={`bi ${kpi.change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
              <span>{Math.abs(kpi.change)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};