import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ServiceService } from 'src/app/service.service';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';

interface ExportColumn {
  title: string;
  dataKey: string;
}
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
interface Object {
  group: string;
  option: string;
  departament: string;
}
@Component({
  selector: 'app-reportkorima',
  templateUrl: './reportkorima.component.html',
  styleUrls: ['./reportkorima.component.css'],
})
export class ReportkorimaComponent implements OnInit {
  departmentSummary: Array<Record<string, any>> = []; // Resumen final por departamento
  departmentDesgloss: Array<Record<string, any>> = []; // Resumen final por departamento

  @ViewChild('dt') table!: Table;
  @ViewChild('dt2') table2!: Table;

  exportColumns!: ExportColumn[];
  cols!: Column[];
  exportColumns2!: ExportColumn[];
  cols2!: Column[];
  loading: boolean = true;
  modal: boolean = false;
  selectedObject: Object = { group: '', option: 'reporte por departamentos',departament:"" };
  constructor(private service: ServiceService<any>,private router: Router) {
    this.cols = [
      {
        field: 'key',
        header: 'Departamento',
        customExportHeader: 'Departamento',
      },
      {
        field: 'picturepositive',
        header: 'Con foto',
        customExportHeader: 'Total',
      },
      {
        field: 'pictureminius',
        header: 'Sin foto',
        customExportHeader: 'Departamento',
      },
      { field: 'total', header: 'Total', customExportHeader: 'Total' },
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.cols2 = [
      { field: 'nombre', header: 'Empleado', customExportHeader: 'Nombre' },
      { field: 'total', header: 'total', customExportHeader: 'Total' },
    ];
    this.exportColumns2 = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  ngOnInit() {
    this.GetKorima();
  }

  GetKorima() {
    this.service.Data<any>('korima').subscribe({
      next: (n: any) => {
        const korimaData = n['data']['result'];
        this.PredialView(korimaData);
      },
      error: (e) => {
      },
    });
  }
  onInputChangeReports(event: any) {
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.table.filterGlobal(inputValue, 'contains');
    }
  }
  onInputChangeReports2(event: any) {
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.table2.filterGlobal(inputValue, 'contains');
    }
  }
  PredialView(korimaData: Array<Record<string, any>>) {
    this.service
      .OtherData<any>(`https://predial.gomezpalacio.gob.mx:4433/api/vistakorima`)
      .subscribe({
        next: (response: Array<Record<string, any>>) => {
          const statsByDepartment: Record<string, any> = {};
  
          response.forEach((item: Record<string, any>) => {
            const departmentName = item['NombreDepartamento'] || 'Sin Departamento';
            const korimaNumber = parseInt(item['NumeroEconomicoKorima'], 10);
  
            // Buscar coincidencia en KorimaData
            const match = korimaData.find(
              (korimaItem) => korimaItem?.['korima'] === korimaNumber
            );
  
            // Evaluar la presencia de 'picture' y 'tag_picture'
            const picture = match?.['picture'] || match?.['tag_picture'] ? 1 : 0;
            
            // Inicializar estadísticas por departamento si no existe
            if (!statsByDepartment[departmentName]) {
              statsByDepartment[departmentName] = {
                key: departmentName,
                picturepositive: 0,
                pictureminus: 0,
                arrayPicturesPositive: [],
                arrayPicturesMinus: [],
              };
            }
  
            const fullName = `${item['Nombres']} ${item['ApellidoPaterno']} ${item['ApellidoMaterno']}`.trim();
          
            // Actualizar estadísticas
            if (picture === 1) {
              statsByDepartment[departmentName].picturepositive++;
              const positivePerson = statsByDepartment[departmentName].arrayPicturesPositive.find(
                (person) => person?.name === fullName
              );
  
              if (positivePerson) {
                positivePerson.total++;
              } else {
                statsByDepartment[departmentName].arrayPicturesPositive.push({
                  name: fullName,
                  total: 1,
                  clave:item['Clave']
                });
              }
            } else {
              statsByDepartment[departmentName].pictureminus++;
              const minusPerson = statsByDepartment[departmentName].arrayPicturesMinus.find(
                (person) => person?.name === fullName
              );
  
              if (minusPerson) {
                minusPerson.total++;
              } else {
                statsByDepartment[departmentName].arrayPicturesMinus.push({
                  name: fullName,
                  total: 1,
                  clave:item['Clave']
                });
              }
            }
          });
          if (localStorage.getItem("role") == "3") {
            const departmentKey = localStorage.getItem("group") || "";
            const departmentStats = statsByDepartment[departmentKey.toUpperCase()];
          
            // Obtener lista de departamentos desde localStorage (manejo de JSON o CSV)
            const departamentosString = localStorage.getItem("departamentos") || "";
            const departamentos = departamentosString.includes("[") 
              ? JSON.parse(departamentosString) 
              : departamentosString.split(",").map(dep => dep.trim());
          
            // Inicializar el resumen sin duplicados (usaremos un Set para evitar duplicados)
            const departmentSummaryMap = new Map();
          
            // Función para calcular total asegurando valores numéricos
            const calculateTotal = (stats) => {
              stats.total = (Number(stats.picturepositive) || 0) + (Number(stats.pictureminus) || 0);
            };
          
            // Agregar el departamento del `group` si existe en `statsByDepartment`
            if (departmentStats) {
              calculateTotal(departmentStats);
              departmentSummaryMap.set(departmentKey.toUpperCase(), departmentStats);
            }
          
            // Agregar los departamentos de la lista si existen en `statsByDepartment` y evitar duplicados
            departamentos.forEach((dep) => {
              const depStats = statsByDepartment[dep.toUpperCase()];
              if (depStats && !departmentSummaryMap.has(dep.toUpperCase())) {
                calculateTotal(depStats);
                departmentSummaryMap.set(dep.toUpperCase(), depStats);
              }
            });
          
            // Convertir el `Map` a un array
            this.departmentSummary = Array.from(departmentSummaryMap.values());
          }
          
         
          else {
            Object.values(statsByDepartment).forEach((departmentStats) => {
              departmentStats.total = departmentStats.picturepositive + departmentStats.pictureminus;
            });
          
            this.departmentSummary = Object.values(statsByDepartment);
          }
          
          this.loading = false;
          
        },
        error: (e) => {
          console.error('Error fetching data:', e);
          this.loading = false;
        },
      });
  }
  
  selectGroup(select: string, option: boolean): void {
    this.selectedObject.departament=select;
    const data = this.departmentSummary.find(
      (item: any) => item.key === select
    );
    if (!data) {
      console.error('No se encontró el grupo con la clave:', select);
      return;
    }

    if (option) {
    
      this.selectedObject.group = 'Con fotos';
      this.departmentDesgloss = data['arrayPicturesPositive'];
    } else {
      this.selectedObject.group = 'Sin fotos';
      this.departmentDesgloss = data['arrayPicturesMinus'];
    }
    this.modal = true;
  }
  redirectToKorima(clave:number){
    this.router.navigate([`/Korima`, clave]);

  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const columnKeys = this.exportColumns.map((column) => column.title);
      const filteredData = this.table.filteredValue || this.departmentSummary; // Si no hay filtro, usa todos los datos

      // Crear una copia de this.guards para no modificar el original directamente
      const modifiedGuards = filteredData.map((guard: { [x: string]: any }) => {
        const modifiedGuard: any = {};
        for (const key in guard) {
          // Buscar una coincidencia en column.dataKey
          const matchingColumn = this.exportColumns.find(
            (column) => column.dataKey === key
          );
          if (matchingColumn) {
            // Si hay una coincidencia, usa column.title como nueva clave
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
      this.saveAsExcelFile(
        excelBuffer,
        'reporte por departamentos de las imagenes de korima'
      );
    });
  }
  exportExcel2() {
    import('xlsx').then((xlsx) => {
      const columnKeys = this.exportColumns2.map((column) => column.title);
      const filteredData = this.table2.filteredValue || this.departmentDesgloss; // Si no hay filtro, usa todos los datos

      // Crear una copia de this.guards para no modificar el original directamente
      const modifiedGuards = filteredData.map((guard: { [x: string]: any }) => {
        const modifiedGuard: any = {};
        for (const key in guard) {
          // Buscar una coincidencia en column.dataKey
          const matchingColumn = this.exportColumns2.find(
            (column) => column.dataKey === key
          );
          if (matchingColumn) {
            // Si hay una coincidencia, usa column.title como nueva clave
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
      this.saveAsExcelFile(
        excelBuffer,
        'reporte de los empleados por el departamento'+ ' ' +
        this.selectedObject.departament
      );
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
  getWidthPercentage(): string {
    const innerWidth = window.innerWidth;
    return innerWidth < 1025 ? '100vw' : '50vw';
  }

  getHeightPercentage(): string {
    const innerWidth = window.innerWidth;
    return innerWidth < 1025 ? '100vh' : '100vh';
  }
}
