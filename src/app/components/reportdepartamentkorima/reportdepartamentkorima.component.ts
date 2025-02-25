import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ServiceService } from 'src/app/service.service';
import * as FileSaver from 'file-saver';

interface ExportColumn {
  title: string;
  dataKey: string;
}
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
@Component({
  selector: 'app-reportdepartamentkorima',
  templateUrl: './reportdepartamentkorima.component.html',
  styleUrls: ['./reportdepartamentkorima.component.css'],
})
export class ReportdepartamentkorimaComponent implements OnInit {
  korima: any[] = [];
  conteos: Record<string, number> = {}; // Objeto para contar ocurrencias
  conteosArray: Array<{ department: string; total: number }> = []; // Convertido en array
  @ViewChild('dt') table!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];
  constructor(private service: ServiceService<any>) {
    this.cols = [
      {
        field: 'Etiqueta',
        header: 'NUMERO DE INVENTARIO',
        customExportHeader: 'Departamento',
      },
      {
        field: 'Descripcion',
        header: 'NOMBRE O DESCRIPCION',
        customExportHeader: 'Total',
      },
      {
        field: 'Marca',
        header: 'MARCA Y MODELO',
        customExportHeader: 'Departamento',
      },
      {
        field: 'DescripcionTipoBien',
        header: 'Tipo',
        customExportHeader: 'Departamento',
      },
      {
        field: 'NoSerie',
        header: 'NUMERO DE SERIE',
        customExportHeader: 'Departamento',
      },
      {
        field: 'Estatus',
        header: 'ESTADO',
        customExportHeader: 'Departamento',
      },
      {
        field: 'NombreDepartamento',
        header: 'ÁREA DE ADSCRIPCION',
        customExportHeader: 'Total',
      },
      {
        field: 'NombreDepartamento',
        header: 'UBICACIÓN',
        customExportHeader: 'Total',
      },
      {
        field: 'NombreCompleto',
        header: 'NOMBRE DEL RESGUARDANTE',
        customExportHeader: 'Total',
      },
      {
        field: 'FechaAlta',
        header: 'FECHA DE ASIGNACION DEL RESGUARDO',
        customExportHeader: 'Total',
      },
      { field: '', header: 'OBSERVACIONES', customExportHeader: 'Total' },
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  ngOnInit() {
    this.getData();
  }
  onInputChangeReports(event: any) {
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.table.filterGlobal(inputValue, 'contains');
    }
  }
  getData() {
    this.service
      .OtherData<any>(
        `https://predial.gomezpalacio.gob.mx:4433/api/vistakorima`
      )
      .subscribe({
        next: (data: Array<Record<string, any>>) => {
          this.conteos = {}; // Reiniciar conteo antes de procesar nuevos datos
          this.korima = data;
          data.forEach((item) => {
            const department = item['NombreDepartamento'] || 'Desconocido';
            this.conteos[department] = (this.conteos[department] || 0) + 1;
          });

          // Convertimos el objeto en un array de objetos
          this.conteosArray = Object.entries(this.conteos).map(
            ([department, total]) => ({
              department,
              total,
            })
          );

          if (localStorage.getItem('role') == '3') {
            const departmentKey = (
              localStorage.getItem('group') || ''
            ).toUpperCase();
            const departamentosString =
              localStorage.getItem('departamentos') || '';

            // Convertir la lista de departamentos en array (desde JSON o CSV)
            const departamentos = departamentosString.includes('[')
              ? JSON.parse(departamentosString)
              : departamentosString
                  .split(',')
                  .map((dep) => dep.trim().toUpperCase());

            // Crear una lista de departamentos permitidos
            const allowedDepartments = new Set([
              departmentKey,
              ...departamentos,
            ]);

            // Filtrar solo los departamentos permitidos
            this.conteosArray = this.conteosArray.filter(({ department }) =>
              allowedDepartments.has(department.toUpperCase())
            );
          }
        },
        error: (e) => {
          console.error(e);
        },
      });
  }
  reportDepartment(group: string): void {
    const departaments = this.korima
      .filter((item) => item?.['NombreDepartamento'] == group)
      .map((item) => ({
        ...item,
        NombreCompleto:
          `${item.Nombres} ${item.ApellidoPaterno} ${item.ApellidoMaterno}`.trim(),
      }))
      .sort((a, b) => a.NombreCompleto.localeCompare(b.NombreCompleto));

    this.exportExcel(departaments);
  }

  exportExcel(departaments: Array<Record<string, any>>) {
    import('xlsx').then((xlsx) => {
      const columnKeys = this.exportColumns.map((column) => column.title);
      const filteredData = departaments;
      const modifiedGuards = filteredData.map((guard: { [x: string]: any }) => {
        const modifiedGuard: any = {};
        for (const key in guard) {
          const matchingColumn = this.exportColumns.find(
            (column) => column.dataKey === key
          );
          if (matchingColumn) {
            modifiedGuard[matchingColumn.title] = guard[key];
          }
        }
        return modifiedGuard;
      });

      const worksheet = xlsx.utils.json_to_sheet(modifiedGuards, {
        header: columnKeys,
      });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'reporte por departamento');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
