import { useState } from "react";
import { DashboardService } from "../service/dashboard.service";

interface KpiData {
  reservationsCount: string;
  ocupationCount: string;
  monthSummary: string;
  pendingInvoices: string;
}

interface KpiResponse {
  status: number;
  message: string;
  data: KpiData;
}

export const useKpiValues = () => {
  const dashboardService = new DashboardService();
  const [kpiValues, setKpiValues] = useState<KpiResponse | null>(null);

  const fetchKpiValues = async () => {
    try {
      const response = await dashboardService.getKpiValues();
      setKpiValues(response.data);
    } catch (error) {
      console.error("Error fetching KPI values:", error);
    }
  };
  return { kpiValues, fetchKpiValues };
};
