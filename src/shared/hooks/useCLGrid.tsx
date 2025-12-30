import { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { toast } from "react-toastify";

export const useCLGrid = <T extends object>() => {
  const dt = useRef<DataTable<T[]>>(null);
  const [expandedRows, setExpandedRows] = useState<T[] | { [key: string]: boolean }>([]);
  const [filters, setFilters] = useState<any>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<T | T[] | null>(null);

  // Exportar a CSV
  const exportCSV = (selectionOnly: boolean = false) => {
    try {
      dt.current?.exportCSV({ selectionOnly });
      toast.success("Datos exportados exitosamente", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error al exportar datos", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Exportar a Excel
  const exportExcel = (data: T[], columns: any[], filename: string = "data") => {
    try {
      import("xlsx").then((xlsx) => {
        // Transformar datos usando los body renderers si existen
        const transformedData = data.map((row: any) => {
          const transformedRow: any = {};
          columns.forEach((col) => {
            const key = String(col.field);
            if (col.body && typeof col.body === 'function') {
              // Si hay un body renderer, usarlo
              const renderedValue = col.body(row);
              // Extraer texto si es un elemento React
              if (typeof renderedValue === 'object' && renderedValue?.props?.children) {
                transformedRow[col.header] = extractTextFromReactElement(renderedValue);
              } else {
                transformedRow[col.header] = renderedValue;
              }
            } else {
              // Usar el valor directo del field
              transformedRow[col.header] = row[key];
            }
          });
          return transformedRow;
        });

        const worksheet = xlsx.utils.json_to_sheet(transformedData);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
        const excelBuffer = xlsx.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        saveAsExcelFile(excelBuffer, filename);
      });
    } catch (error) {
      toast.error("Error al exportar a Excel", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Función auxiliar para extraer texto de elementos React
  const extractTextFromReactElement = (element: any): string => {
    if (typeof element === 'string' || typeof element === 'number') {
      return String(element);
    }
    if (Array.isArray(element)) {
      return element.map(extractTextFromReactElement).join('');
    }
    if (element?.props?.children) {
      return extractTextFromReactElement(element.props.children);
    }
    return '';
  };

  // Guardar archivo Excel
  const saveAsExcelFile = (buffer: any, fileName: string) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
        toast.success("Archivo Excel descargado", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    });
  };

  // Exportar a PDF
  const exportPdf = (data: T[], columns: any[], filename: string = "data") => {
    try {
      import("jspdf").then((jsPDF) => {
        import("jspdf-autotable").then(() => {
          const doc = new jsPDF.default("p", "px", "a4") as any;
          
          const exportColumns = columns.map((col) => ({
            title: col.header,
            dataKey: col.field,
          }));

          // Transformar datos usando los body renderers si existen
          const transformedData = data.map((row: any) => {
            const transformedRow: any = {};
            columns.forEach((col) => {
              const key = String(col.field);
              if (col.body && typeof col.body === 'function') {
                const renderedValue = col.body(row);
                if (typeof renderedValue === 'object' && renderedValue?.props?.children) {
                  transformedRow[key] = extractTextFromReactElement(renderedValue);
                } else {
                  transformedRow[key] = renderedValue;
                }
              } else {
                transformedRow[key] = row[key];
              }
            });
            return transformedRow;
          });
          
          doc.autoTable({
            columns: exportColumns,
            body: transformedData,
            styles: { fontSize: 8 },
          });
          
          doc.save(`${filename}_${new Date().getTime()}.pdf`);
          toast.success("PDF descargado exitosamente", {
            position: "top-right",
            autoClose: 2000,
          });
        });
      });
    } catch (error) {
      toast.error("Error al exportar a PDF", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filtro global
  const onGlobalFilterChange = (value: string) => {
    const _filters = { ...filters };
    _filters["global"] = { value: value, matchMode: "contains" };
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters(null);
    setGlobalFilterValue("");
  };

  // Manejo de expansión de filas
  const onRowToggle = (e: any) => {
    setExpandedRows(e.data);
  };

  // Manejo de selección
  const onSelectionChange = (e: { value: T | T[] }) => {
    setSelectedRows(e.value);
  };

  return {
    dt,
    expandedRows,
    setExpandedRows,
    filters,
    setFilters,
    globalFilterValue,
    setGlobalFilterValue,
    selectedRows,
    setSelectedRows,
    exportCSV,
    exportExcel,
    exportPdf,
    onGlobalFilterChange,
    clearFilters,
    onRowToggle,
    onSelectionChange,
  };
};