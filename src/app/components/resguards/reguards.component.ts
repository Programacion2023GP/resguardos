import {Component, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import { DialogService } from 'primeng/dynamicdialog';
import { fadeInOutAnimation } from 'src/app/components/animations/animate';

// import * as xlsx from 'xlsx';
import 'jspdf-autotable';

import { ServiceService } from 'src/app/service.service';
import { Route, Router } from '@angular/router';
import { TicketComponent } from '../ticket/ticket.component';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

interface Option {
  departamento: string;
}
interface Option2 {
  id:number;
  name: string;
}
@Component({
  selector: 'app-reguards',
  templateUrl: './reguards.component.html',
  styleUrls: ['./reguards.component.css'],
  animations:[fadeInOutAnimation]

})
export class ReguardsComponent  {


  roleTypeUser:any = localStorage.getItem('role')




    groups:any=[]
  cols!: Column[];
    selectedColumns!: Column[];
     Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  exportColumns!: ExportColumn[];
  addTr: number = 0;
  inputsForm: any = [];
  MyForm!: FormGroup;
  myFormUpdate!: FormGroup;
  first = 0;
  imagePreview: string | ArrayBuffer | null = null;
   resguardSelected!:string|null
  @ViewChild('dt') table!: Table;
  @ViewChild('dt1') tableReports!: Table;
  filteredOptions: Option[] = []; // Opciones filtradas para mostrar en el dropdown
  filteredOptions2: Option2[] = []; // Opciones filtradas para mostrar en el dropdown
  filteredOptions3: Option2[] = []; // Opciones filtradas para mostrar en el dropdown

  searchText = ''; // Texto de búsqueda ingresado por el usuario
  searchText2 = ''; // Texto de búsqueda ingresado por el usuario

  showDropdown = false;
  showDropdown2 = false;
  showDropdown3 = false;

  loading: boolean = false;
  action:'edit'|'insert'='insert'

  rows = 10;
  guards: any = [

  ]

 guardSave:any =[]
  conteo: number = 0;
  modal: boolean = false;
  options:boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  value:any;
  clonedProducts: { [s: string]: any } = {};
  editing: any;
  brand = localStorage.getItem('brand') !== null ? localStorage.getItem('brand') : ''; //marca
  type = localStorage.getItem('type') !== null ? localStorage.getItem('type') : ''; //tipo
  state = localStorage.getItem('state') !== null ? localStorage.getItem('state') : ''; //estado fisico

  serial = localStorage.getItem('serial') !== null ? localStorage.getItem('serial') : ''; //serial
  airlne = localStorage.getItem('airlne') !== null ? localStorage.getItem('airlne') : ''; //aerea de adscripcion
  numberNomina = localStorage.getItem('numberNomina') !== null ? localStorage.getItem('numberNomina') : ''; //aerea de adscripcion
  checked = localStorage.getItem('checked') !== null ? false : true;
  dialogmodal: boolean= false;
  history: any=[];
  selected? : string| null
  types:any=[]
  states:any=[]

  selected2? : string| null
  //numero de nomina

  constructor(private fb: FormBuilder,private service:ServiceService<any>,private route:Router,private dialogService: DialogService) {
    this.roleTypeUser = parseInt(this.roleTypeUser)

    this.MyForm = new FormGroup({
      id: new FormControl(''),
      picture:new FormControl('',Validators.required),
      type:new FormControl('',Validators.required),
      type_id:new FormControl(''),

      description:new FormControl('',Validators.required),
      brand:new FormControl('',Validators.required),
      state:new FormControl('',Validators.required),
      state_id:new FormControl('',Validators.required),

      serial:new FormControl('',Validators.required),
      number_korima: new FormControl('', {}),

      // airlane:new FormControl('',Validators.required),
      group:new FormControl('',Validators.required),
      observations:new FormControl(''),
    });
    if (this.roleTypeUser >2 ){
      this.MyForm.removeControl('group');
    }
    this.GetDataGroups()
    this.DataTypes()
    this.DataStates()

    this.cols = [
      { field: 'stock_number', header: 'NUMERO DE INVENTARIO', customExportHeader: 'NUMERO DE INVENTARIO' },
      { field: 'description', header: 'DESCRIPCIÓN', customExportHeader: 'DESCRIPCIÓN' },
      { field: 'brand', header: 'MARCA Y MODELO', customExportHeader: 'MARCA Y MODELO' },
      { field: 'Tipo', header: 'TIPO DE RESGUARDO', customExportHeader: 'TIPO DE RESGUARDO' },
      { field: 'serial', header: 'NUMERO SERIAL', customExportHeader: 'NUMERO SERIAL' },
      { field: 'number_korima', header: 'NUMERO DE KORIMA', customExportHeader: 'NUMERO DE KORIMA' },
      { field: 'Estado', header: 'ESTADO', customExportHeader: 'ESTADO' },
      { field: 'group', header: 'DEPARTAMENTO', customExportHeader: 'DEPARTAMENTO' },
      { field: 'motive', header: 'MOTIVO DADO DE BAJA', customExportHeader: 'MOTIVO DADO DE BAJA' },
      { field: 'observations', header: 'OBSERVACIONES', customExportHeader: 'OBSERVACIONES' },
  ];

  this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  this.getGuards()
  }
  showTableReport(guard:any){
    this.resguardSelected = guard.description
    this.service.Data<any>(`guards/history/${guard.id}`).subscribe({
      next: (n:any) => {
        this.history = n['data']['result']
        this.dialogmodal = true
        console.log("HIS",this.history)
      }
    })
  }
  DataTypes(){
    this.service.Data<any>(`types`).subscribe({
      next: (n:any) => {
        this.types = n['data']['result']
      }
    })
  }
  DataStates(){
    this.service.Data<any>(`states`).subscribe({
      next: (n:any) => {
        this.states = n['data']['result']
        console.warn(this.states)
      }
    })
  }
  clearFileInput() {
    this.fileInput.nativeElement.value = '';
  }

showDialog(){
  this.imagePreview = null
  this.clearFileInput()
  this.MyForm.reset()
  this.action = 'insert'
  this.modal = true
}
onFileSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];
  if (file) {
    const imageSizeInBytes = file.size;

    const imageSizeInKB = imageSizeInBytes / 1024;
  
    const imageSizeInMB = imageSizeInKB / 1024;  
    if (imageSizeInMB <= 2) {
      this.Toast.fire({
        position: 'top-end',
        icon: 'error',
        title: `la imagen supera el tamaño permitido`,
      });
      return
    }
  }
  

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    this.onFileChangeUpdate(event)
    };
    reader.readAsDataURL(file);
  } else {
    this.imagePreview = null;
  }
}

openFileInput() {
  this.fileInput.nativeElement.click();
}

onFileChange(event: any, index: number): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const base64String = e.target.result.split(',')[1];
      this.MyForm.get('img' + index)?.setValue(base64String);
      this.MyForm.get('picture' + index)?.setValue(event.target.files)
    };

    reader.readAsDataURL(file);
  }
}
onFileChangeUpdate(event: any): void {

      this.MyForm.get('picture')?.setValue(event.target.files)



}
onInputChange(event: any) {
  if (event && event.target) {
    const inputValue: string = event.target.value;
    this.tableReports.filterGlobal(inputValue, 'contains');
  }
}

GetDataGroups() {


  this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/departamentos/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
    next: (n:any) => {
       this.groups = n.RESPONSE.recordsets[0]
    },
    error: (e:any) => {
     
    }

  })

}
showAllOptions(): void {
  this.filteredOptions = this.groups;
  this.showDropdown = true;
}
showAllOptions2(): void {
  this.filteredOptions2 = this.types;
  this.showDropdown2 = true;
}
showAllOptions3(): void {
  this.filteredOptions3 = this.states;
  this.showDropdown3 = true;
}
onBlur(): void {
  setTimeout(() => {
    this.showDropdown = false;
  }, 200);
}
onBlur2(): void {
  setTimeout(() => {
    this.showDropdown2 = false;
  }, 200);
}
onBlur3(): void {
  setTimeout(() => {
    this.showDropdown3 = false;
  }, 200);
}
onSearch(event: Event): void {
  const searchText = (event.target as HTMLInputElement).value.toLowerCase();

  this.filteredOptions = this.groups.filter(option => option.departamento.toLowerCase().includes(searchText));
}
onSearch2(event: Event): void {
  const searchText = (event.target as HTMLInputElement).value.toLowerCase();

  this.filteredOptions2 = this.types.filter(option => option.name.toLowerCase().includes(searchText));
}
onSearch3(event: Event): void {
  const searchText = (event.target as HTMLInputElement).value.toLowerCase();

  this.filteredOptions3 = this.states.filter(option => option.name.toLowerCase().includes(searchText));
}
selectOption(option: Option): void {
  this.searchText = option.departamento;
  this.showDropdown = false;
  this.selected= option.departamento
  const exist = this.groups.filter(item=>item.departamento == option.departamento)
  if (exist) {
    this.MyForm.get('group')?.setValue(option.departamento)
  }
}
selectOption2(option: Option2): void {
  this.searchText2 = option.name;
  this.showDropdown2 = false;
  this.selected2= option.name
  const exist = this.types.filter(item=>item.name == option.name)
  if (exist) {
    this.MyForm.get('type')?.setValue(option.name)
    this.MyForm.get('type_id')?.setValue(option.id)

  }
}
selectOption3(option: Option2): void {
  this.showDropdown3 = false;
  const exist = this.states.filter(item=>item.name == option.name)
  if (exist) {
    this.MyForm.get('state')?.setValue(option.name)
    this.MyForm.get('state_id')?.setValue(option.id)

  }
}

exportExcel() {
  import('xlsx').then((xlsx) => {
    const columnKeys = this.exportColumns.map((column) => column.title);

    const modifiedGuards = this.history.map((guardSave: { [x: string]: any; }) => {
      const modifiedGuard: any = {};
      for (const key in guardSave) {
        const matchingColumn = this.exportColumns.find((column) => column.dataKey === key);
        if (matchingColumn) {
          modifiedGuard[matchingColumn.title] = guardSave[key];
        }
      }
      return modifiedGuard;
    });

    const worksheet = xlsx.utils.json_to_sheet(modifiedGuards, { header: columnKeys });
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Resguardos');
  });
}





saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data,this.resguardSelected+ EXCEL_EXTENSION);
}

  onSubmit() {

    this.loading = true;

    const formData = this.MyForm.value;
    const form = new FormData();

    for (const key of Object.keys(formData)) {

      if (key.includes('picture')) {
        const files = formData[key];
        if (files && files.length > 0) {
          const file = files[0];
          const newKey = `${key}`;
          form.append(newKey, file);
        }

      } else {
        form.append(key, formData[key]);
      }
    }




    let url = 'guards'
    if (this.action !='insert') {
      url = 'guards/update'
    }

    this.service.Post(url,form).subscribe({
      next:(n:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se ha ${url =='guards'?'insertado':'actualizado'} correctamente`,
        });
       },
      error:(e:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: ` No se ha podido ${url =='guards'?'insertar':'actualizar'}`,
        });
        this.modal = false
        this.loading = false;

        this.MyForm.reset()
        this.clearFileInput()

      },
      complete:()=>{
        // this.table.reset()
        this.action ='insert'
        this.loading = false;
        if (this.checked||this.action !='insert') {
          this.MyForm.reset()
          this.clearFileInput()
          this.modal = false
        }
        else{
          this.myFormUpdate.get(`picture`)?.setValue('');
          this.myFormUpdate.get(`description`)?.setValue('');
          this.myFormUpdate.get(`observations`)?.setValue('');

          this.clearFileInput()
        }
        this.getGuards()

      }
    })

  }

  
  getGuards(){
    this.loading = true;

    this.service.Data<any>("guards").subscribe({
      next:(n:any)=>{
        this.guardSave =n['data']["result"]

      },
      error:(e:any)=>{
        this.loading = false;

      },
      complete:()=>{

        this.loading = false;

      }
    })
  }
  removeGuard(id:number){
    this.loading = true
    this.service.Delete(`guardsdestroy/${id}`).subscribe({
      next:(n:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `se ha eliminado correctamente`,
        });
      },
      error:(e:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `no se ha podido eliminar`,
        });
        this.loading = false

      },
      complete:()=>{
        this.loading = false
        this.getGuards()
      }
    })
  }
  AcceptRemove(guards:any) {
    this.loading = true
    this.service.Delete(`guards/expecting/${guards.id}`).subscribe({
      next:(n:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `se ha aceptado la baja correctamente`,
        });
      },
      error:(e:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `no se ha podido aceptar la baja`,
        });
        this.loading = false

      },
      complete:()=>{
        this.loading = false
        this.getGuards()
      }
    })
    }
 searchEmployeed(event:any ){
  this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/empleados/${event.target.value}/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
  next:(n:any)=>{
    const employed = n.RESPONSE.recordsets[0][0]
    console.log(employed)
    this.myFormUpdate.get('employeed')?.setValue(`${employed.nombreE} ${employed.apellidoP} ${employed.apellidoM}`)
    this.myFormUpdate.get('group')?.setValue(`${employed.departamento}`)

  },
  error:(e:any)=>{
    this.myFormUpdate.get('employeed')?.setValue(``)
    this.myFormUpdate.get('group')?.setValue(``)
  }

  })
 }
 Close(){
  this.options = false


 }
 Destroy(){
  localStorage.removeItem('brand')
  localStorage.removeItem('type')
  localStorage.removeItem('state')
  localStorage.removeItem('serial')
  localStorage.removeItem('airlne')
  localStorage.removeItem('numberNomina')
  localStorage.removeItem('checked')

  this.brand = null
  this.type = null
  this.state =null
  this.serial = null
  this.airlne = null
  this.numberNomina = null
  this.myFormUpdate.get('brand')?.setValue('')
  this.myFormUpdate.get('type')?.setValue('')
  this.myFormUpdate.get('state')?.setValue('')
  this.myFormUpdate.get('serial')?.setValue('')
  this.myFormUpdate.get('payroll')?.setValue('')
  this.myFormUpdate.get('airlne')?.setValue('')


  this.options = false
 }
 onInputChangeReports(event: any) {
  if (event && event.target) {
    // Ahora TypeScript sabe que event.target no es nulo
    const inputValue: string = event.target.value;
    this.table.filterGlobal(inputValue, 'contains');
  }
}
changeResguardState(guard: any) {

         

           if (guard.active ==1) {
            Swal.fire({
              title: 'Motivo de la baja',
              input: 'text',
              inputPlaceholder: 'Ingresa el motivo',
              showCancelButton: true,
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Eliminar',
              preConfirm: (motivo) => {
                if (!motivo) {
                  Swal.showValidationMessage('Debes ingresar un motivo');
                }
                return motivo;
              }
            }).then((motivoResult) => {
              if (motivoResult.isConfirmed) {
                const json = {
                  motive:motivoResult.value
                }
               
            this.service.Post(`guardsdestroy/${guard.id}`,json).subscribe({
              next:()=>{
                this.getGuards()
                this.Toast.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: `se a cambiado el estado`,
                });
              },
              error:()=>{
                this.getGuards()
                if (guard.active == 1) {
                  this.Toast.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `no se puede dar de baja ya que esta en uso`,
                  });
                }
              }
           })
              }
            });
           }
           else{
            this.service.Post(`guardsdestroy/${guard.id}`,{}).subscribe({
              next:()=>{
                this.getGuards()
                this.Toast.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: `se a cambiado el estado`,
                });
              },
              error:()=>{
                this.getGuards()
                if (guard.active == 1) {
                  this.Toast.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `no se puede dar de baja ya que esta en uso`,
                  });
                }
              }
           })
           }


         
          
     




  }
  print(guard: any) {
    this.service.setData({guard})
    const ref = this.dialogService.open(TicketComponent, {
      // header: this.name,
      width: '100%',
      contentStyle: {'max-height': '100%', 'overflow': 'auto'}
    });
  }
 

  EditGuard(guard:any){
    console.warn(guard)
    this.MyForm.get('id')?.setValue(guard.id)
    this.action = 'edit'
    Object.keys(guard).forEach(key => {
      if (this.MyForm.get(key)) {
        this.MyForm.get(key)?.setValue(guard[key]);
      }
      if (key == 'picture') {
        this.imagePreview = guard[key]
      }
      if (key == 'Tipo') {
        this.MyForm.get('type')?.setValue(guard['Tipo']);

      }
      if (key == 'Estado') {
        this.MyForm.get('state')?.setValue(guard['Estado']);

      }
    });

    this.modal = true
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


