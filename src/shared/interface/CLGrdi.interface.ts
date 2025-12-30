import type { ColumnProps } from "primereact/column";
import type { DataTableProps, DataTableValueArray } from "primereact/datatable";

export interface CLGridColumn<T = any> extends Omit<ColumnProps, "field"> {
  field: keyof T | string;
  header: string;
  body?: (rowData: T) => React.ReactNode;
  editor?: (options: any) => React.ReactNode;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  filterMatchMode?: string;
  exportable?: boolean;
  reorderable?: boolean;
  frozen?: boolean;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

export interface CLGridProps<T extends DataTableValueArray = any[]>
  extends Omit<DataTableProps<T>, "value" | "frozenValue"> {
  // Datos
  data: T;
  columns: CLGridColumn<T extends any[] ? T[number] : any>[];

  // Identificación
  dataKey?: string;

  // Paginación
  paginator?: boolean;
  rows?: number;
  rowsPerPageOptions?: number[];

  // Selección
  selectionMode?: "single" | "multiple" | "checkbox" | "radiobutton";
  selection?: T[number] | T | null;
  onSelectionChange?: (e: { value: T[number] | T }) => void;

  // Expansión de filas
  expandable?: boolean;
  rowExpansionTemplate?: (data: T[number]) => React.ReactNode;
  expandedRows?: T | { [key: string]: boolean };
  onRowToggle?: (e: any) => void;

  // Edición de filas
  editMode?: "row" | "cell";
  onRowEditComplete?: (e: any) => void;
  onRowEditInit?: (e: any) => void;
  onRowEditCancel?: (e: any) => void;

  // Reordenamiento
  reorderableColumns?: boolean;
  reorderableRows?: boolean;
  onColReorder?: (e: any) => void;
  onRowReorder?: (e: any) => void;

  // Exportación
  exportable?: boolean;
  exportFilename?: string;

  // Filtrado
  filters?: any;
  filterDisplay?: "menu" | "row";
  globalFilterFields?: string[];
  onFilter?: (e: any) => void;

  // Scroll
  scrollable?: boolean;
  scrollHeight?: string;
  frozenValue?: T;

  // Carga
  loading?: boolean;

  // Estilos
  className?: string;
  style?: React.CSSProperties;

  // Callbacks
  onRowClick?: (e: any) => void;
  onRowDoubleClick?: (e: any) => void;

  // Responsive
  responsiveLayout?: "scroll" | "stack";

  // Agrupación
  rowGroupMode?: "subheader" | "rowspan";
  groupRowsBy?: string;

  // Virtual Scroll
  virtualScrollerOptions?: any;

  // Templates
  header?: React.ReactNode;
  footer?: React.ReactNode;
  emptyMessage?: string;
  gridTitle?: string;
}
