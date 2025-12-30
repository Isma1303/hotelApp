export interface IDashboard {}

export interface IDashboardNew extends Omit<IDashboard, "id"> {}
export interface IDashboardUpdate extends Partial<IDashboardNew> {}
