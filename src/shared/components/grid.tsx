import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import type { CLGridProps } from "../interface/CLGrdi.interface";
import { useCLGrid } from "../hooks/useCLGrid";
import "./grid.css";

export const CLGrid = <T extends any[]>(props: CLGridProps<T>) => {
  const {
    data,
    columns,
    dataKey = "id",
    paginator = true,
    rows = 10,
    rowsPerPageOptions = [5, 10, 25, 50],
    selectionMode,
    expandable = false,
    rowExpansionTemplate,
    editMode,
    onRowEditComplete,
    onRowEditInit,
    onRowEditCancel,
    reorderableColumns = false,
    reorderableRows = false,
    onColReorder,
    onRowReorder,
    exportable = false,
    exportFilename = "data",
    filterDisplay,
    globalFilterFields,
    scrollable = false,
    scrollHeight = "400px",
    loading = false,
    className = "",
    style,
    onRowClick,
    onRowDoubleClick,
    responsiveLayout = "scroll",
    header,
    footer,
    emptyMessage = "No se encontraron registros",
    gridTitle,
    ...restProps
  } = props;

  const {
    dt,
    expandedRows,
    filters,
    globalFilterValue,
    selectedRows,

    exportExcel,
    exportPdf,
    onGlobalFilterChange,
    clearFilters,
    onRowToggle,
    onSelectionChange,
  } = useCLGrid<T>();

  const renderEmptyMessage = () => {
    return (
      <div className="cl-grid-empty-message">
        <div className="cl-grid-empty-icon">
          <i className="bi bi-inbox"></i>
        </div>
        <h3 className="cl-grid-empty-title">{emptyMessage}</h3>
        <p className="cl-grid-empty-subtitle">
        </p>
        {globalFilterFields && (
          <Button
            label="Limpiar filtros"
            onClick={clearFilters}
            className="p-button-outlined p-button-sm"
          />
        )}
      </div>
    );
  };

 const renderToolbar = () => {
  if (!exportable && !globalFilterFields) return null;

  return (
    <Toolbar
      className="w-100"
      start={
        <div className="d-flex align-items-center gap-2 flex-nowrap">
          <span className="fw-semibold">{gridTitle}</span>

          {globalFilterFields && (
            <>
              <InputText
                value={globalFilterValue}
                onChange={(e) => onGlobalFilterChange(e.target.value)}
                placeholder="Buscar..."
              />
              <Button
                type="button"
                icon="pi pi-filter-slash"
                outlined
                onClick={clearFilters}
                label="Limpiar"
              />
            </>
          )}
        </div>
      }
      end={
        exportable ? (
          <div className="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <Button
              type="button"
              icon="bi bi-file-earmark-excel"
              rounded
              onClick={() => exportExcel(data, columns, exportFilename)}
              tooltip="Exportar a Excel"
              tooltipOptions={{ position: 'bottom' }}
              className="p-button-sm p-button-rounded p-button-text"
              style={{ width: '2.5rem', height: '2.5rem', padding: 0 }}
            />
            <Button
              type="button"
              icon="bi bi-file-earmark-pdf"
              rounded
              onClick={() => exportPdf(data, columns, exportFilename)}
              tooltip="Exportar a PDF"
              tooltipOptions={{ position: 'bottom' }}
              className="p-button-sm p-button-rounded p-button-text"
              style={{ width: '2.5rem', height: '2.5rem', padding: 0 }}
            />
          </div>
        ) : null
      }
    />
  );
};


  const filteredRestProps = Object.fromEntries(
    Object.entries(restProps).filter(([_, value]) => value !== undefined)
  );

  return (
    <div className="cl-grid-wrapper">
      {renderToolbar()}
      <DataTable
        ref={dt}
        value={data}
        dataKey={dataKey}
        paginator={paginator}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        selectionMode={selectionMode}
        expandedRows={expandedRows}
        onRowToggle={expandable ? onRowToggle : undefined}
        rowExpansionTemplate={expandable ? rowExpansionTemplate : undefined}
        editMode={editMode}
        onRowEditComplete={onRowEditComplete}
        onRowEditInit={onRowEditInit}
        onRowEditCancel={onRowEditCancel}
        reorderableColumns={reorderableColumns}
        reorderableRows={reorderableRows}
        onColReorder={onColReorder}
        onRowReorder={onRowReorder}
        filters={filters}
        filterDisplay={filterDisplay}
        globalFilterFields={globalFilterFields}
        scrollable={scrollable}
        scrollHeight={scrollHeight}
        loading={loading}
        className={`cl-grid-dark ${className}`}
        style={style}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        responsiveLayout={responsiveLayout}
        footer={footer}
        emptyMessage={renderEmptyMessage()}
        {...filteredRestProps}
      >
        {reorderableRows && (
          <Column rowReorder style={{ width: "3rem" }} />
        )}
        
        {expandable && (
          <Column expander style={{ width: "3rem" }} />
        )}
        
        {selectionMode === 'checkbox' && (
          <Column selectionMode="multiple" style={{ width: "3rem" }} />
        )}
        
        {columns.map((col, index) => {
          const { field, header, ...colRest } = col;
          return (
            <Column
              key={`${String(field)}-${index}`}
              field={typeof field === 'string' ? field : undefined}
              header={header}
              body={col.body}
              editor={col.editor}
              sortable={col.sortable ?? true}
              filter={col.filter ?? false}
              filterPlaceholder={col.filterPlaceholder}
              filterMatchMode={col.filterMatchMode}
              reorderable={col.reorderable ?? reorderableColumns}
              frozen={col.frozen}
              style={col.style}
              bodyStyle={col.bodyStyle}
              headerStyle={col.headerStyle}
              {...colRest}
            />
          );
        })}
        
        {editMode === 'row' && (
          <Column
            rowEditor
            headerStyle={{ width: '10%', minWidth: '8rem' }}
            bodyStyle={{ textAlign: 'center' }}
          />
        )}
      </DataTable>
    </div>
  );
};