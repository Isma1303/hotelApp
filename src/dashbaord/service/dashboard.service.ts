import { parentService } from "../../shared";
import type {
  IDashboard,
  IDashboardNew,
  IDashboardUpdate,
} from "../interfaces/dashboard.interface";

export class DashboardService extends parentService<
  IDashboard,
  IDashboardNew,
  IDashboardUpdate
> {
  constructor() {
    super("dashboard");
  }

  public async getKpiValues() {
    try {
      return await this.http.get<any>(`/kpi-values`);
    } catch (error) {
      throw error;
    }
  }
}
