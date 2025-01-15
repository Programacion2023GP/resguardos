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
  selector: 'app-reportgroupsguards',
  templateUrl: './reportgroupsguards.component.html',
  styleUrls: ['./reportgroupsguards.component.css']
})

export class ReportgroupsguardsComponent implements OnInit {
  data =[]
  dataCopy:any;
  @ViewChild('dt') table!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];
 loading:boolean=true
  constructor(private service: ServiceService<any>) {
    this.getData();
    this.cols = [
      { field: 'nombre', header: 'Departamento', customExportHeader: 'Departamento' },
      { field: 'total', header: 'Total', customExportHeader: 'Total' },
     
   

  ];
  this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

   }

  ngOnInit() {
  }
  getData(){
    this.service.Data<any>('charts/groups').subscribe({
      next: (n: any) => {
        this.data = n['data']['result'];
        this.dataCopy = n['data']['result'];

      },
      error: (err: any) => {}
    });
  }
  
  onInputChangeReports(event: any) {
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.table.filterGlobal(inputValue, 'contains');
    }
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const columnKeys = this.exportColumns.map((column) => column.title);
      const filteredData = this.table.filteredValue || this.data; // Si no hay filtro, usa todos los datos

      // Crear una copia de this.guards para no modificar el original directamente
      const modifiedGuards = filteredData.map((guard: { [x: string]: any; }) => {
        const modifiedGuard: any = {};
        for (const key in guard) {
          // Buscar una coincidencia en column.dataKey
          const matchingColumn = this.exportColumns.find((column) => column.dataKey === key);
          if (matchingColumn) {
            // Si hay una coincidencia, usa column.title como nueva clave
            modifiedGuard[matchingColumn.title] = guard[key];
          }
        }
        return modifiedGuard;
      });

      const worksheet = xlsx.utils.json_to_sheet(modifiedGuards, { header: columnKeys });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'usuarios');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data,'reporte de fotos de korima' + EXCEL_EXTENSION);
  }
}