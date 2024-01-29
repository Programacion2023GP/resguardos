import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { fadeInOutAnimation } from 'src/app/components/animations/animate';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
interface Option2 {
  Id_Empelado:number
  nombreE:string,
  apellidoP:string,
  apellidoM:string,
  departamento:string
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  animations:[fadeInOutAnimation]
})
export class UsersComponent implements OnInit {


  
  private socket!: WebSocket;

  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  namesafter:any=[]
  departamentos = localStorage.getItem("departamentos")?.split(",");
  names:any=[]
  originalData:any=[]
  exportColumns!: ExportColumn[];
  cols!: Column[];
  filteredOptions2: Option2[] = []; // Opciones filtradas para mostrar en el dropdown
  showDropdown2 = false;
  listVerifyCheckeds :any[]= []
  idUser! : number|null
  loading:any = false
  users: any[] = [];
  roleUser!: number
  visible: boolean = false;
  MyForm!: FormGroup
  isMenuOpen: boolean = false;
  showProfiles: boolean = false;
  profilesOptionsShow: any
  action!: Boolean
  roleTypeUser: any = localStorage.getItem('role')
  @ViewChild('dt') table!: Table;
  dialogmodal!: boolean;
  report!: any[];
  group!:string
  groups: any;
  groupsCopy:any;
  groupSelects: any[] = []; 
  openGroups!: Boolean ;
  showDialog() {
    this.MyForm.reset()
    this.groupSelects =[]
    this.resetListGroups()
    this.openGroups = false
    this.action = true
    this.visible = true
  }
  isDropdownOpen = false;
  constructor(private service: ServiceService<any>) {
    this.GetDataGroups()
    console.warn("departamentos",this.departamentos)
    
    this.roleTypeUser = parseInt(this.roleTypeUser)
    this.GetUsers()
    this.GetDataNameUser();
    this.MyForm = new FormGroup({
      id: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      payroll: new FormControl('', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]),
      name: new FormControl('', Validators.required),
      group: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      groups: new FormControl('')

    });
    this.cols = [
      { field: 'stock_number', header: 'NUMERO DE INVENTARIO', customExportHeader: 'NUMERO DE INVENTARIO' },
      { field: 'description', header: 'NOMBRE O DESCRIPCIÓN	', customExportHeader: 'NOMBRE O DESCRIPCIÓN' },
      { field: 'brand', header: 'MARCA Y MODELO', customExportHeader: 'Descripción del producto' },
      { field: 'type', header: 'TIPO', customExportHeader: 'Cantidad o Pieza' },
      { field: 'state', header: 'ESTADO FISICO', customExportHeader: 'Valor' },
      { field: 'airlane', header: 'ÁEREA DE ADSCRIPCION', customExportHeader: 'Departamento' },
      { field: 'group', header: 'UBICACIÓN/DEPARTAMENTO', customExportHeader: 'Numero de etiqueta' },
      { field: 'dateup', header: 'FECHA DE ASIGNACIÓN DEL RESGUARDO', customExportHeader: 'Numero de nomina' },
      { field: 'datedown', header: 'FECHA DE BAJA DEL RESGUARDO	', customExportHeader: 'Numero de nomina' },
      { field: 'name', header: 'NOMBRE DEL RESGUARDANTE', customExportHeader: 'Numero de nomina' },

  ];

  this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }
  GetDataGroups() {


    this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/departamentos/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
      next: (n:any) => {
         this.groups = n.RESPONSE.recordsets[0]
          this.resetListGroups()
      },
      error: (e:any) => {
       
      }
  
    })
  
  }
  resetListGroups(){
    this.groupsCopy = this.groups.map((group) => {
      const newGroup = { ...group };
      newGroup.checked = 0; 
      return newGroup;
    });      
    this.listVerifyCheckeds = this.groupsCopy
  }


  ngOnInit(): void {
    // this.socket = new WebSocket('ws://localhost:3001');

    // this.socket.addEventListener('open', (event) => {
    //   console.log('Conexión WebSocket establecida');
    //   this.socket.send('Hola, servidor!');
    // });

    // this.socket.addEventListener('message', (event) => {
    //   console.log('Mensaje desde el servidor:', event.data);
    // });
  }
  
  showText(profile: number): void {
    this.profilesOptionsShow = profile
    this.showProfiles = true; // Borra el texto al salir
  }
  selectOption2(id: Option2): void {
    this.showDropdown2 = false;
    const exist = this.names.find(item => item.Id_Empelado === id);
   
    if (exist) {
      console.log(this.departamentos?.includes(exist.departamento))
      if(localStorage.getItem("group")!=exist.departamento && this.roleTypeUser ==3 && !this.departamentos?.includes(exist.departamento)   ){
        this.Toast.fire({
          position: 'top-end',
          icon: 'warning',
          title: `no pertenece a tu departamento`,
        });
        return
      }
      this.MyForm.get('name')?.setValue(`${exist.nombre}`)
      this.MyForm.get('group')?.setValue(`${exist.departamento}`)
      this.MyForm.get('payroll')?.setValue(`${exist.codigoEmpleado}`)

    }
   
  }
  hideText(): void {
    this.showProfiles = false; // Borra el texto al salir
  }
  onSearch2(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
  
    this.filteredOptions2 = this.names.filter(option => option.name.toLowerCase().includes(searchText));
  }
  onBlur2(): void {
    setTimeout(() => {
      this.showDropdown2 = false;
    }, 200);
  }
  showAllOptions2(): void {
    this.filteredOptions2 = this.names;
    this.showDropdown2 = true;
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  indicateOption(item:string){
    switch (item) {
      case 'Administrativo':
        this.roleUser = 2
        break;
      case 'Enlance':
        this.roleUser = 3

        break;
      case 'Empleado':
        this.roleUser = 4

        break;

    }
  }

  selectItem(item: string, inputElement: HTMLInputElement) {
    this.hideText()
    inputElement.value = item;
    this.MyForm.get('role')?.setValue(item)
    this.indicateOption(item)
    this.openGroups = false

    this.isDropdownOpen = false;
  }
  GetDataNameUser() {

    this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/empleadosnombre/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
      next: (n:any) => {
        this.originalData = n.RESPONSE.recordsets[0]
    // Crear un nuevo arreglo con la propiedad 'nombre' concatenada
   

      },
      error: (e:any) => {

      },complete:()=> {

        this.names = this.originalData.map((item: any) => {
          return {
            nombre: `${item.nombreE} ${item.apellidoP} ${item.apellidoM}`,
            // Incluir otros datos según sea necesario
            Id_Empelado: item.Id_Empelado,
            departamento: item.departamento,
            codigoEmpleado: item.codigoEmpleado,

          };
        });
        this.namesafter =this.names
      },

    })

  }
  GetDataUser(event: any) {
    
    if (event.target.value.length < 5) {
      this.MyForm.get('name')?.setValue(``)
      this.MyForm.get('group')?.setValue(``)
      return
    }

    this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/empleados/${event.target.value}/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
      next: (n:any) => {
        const employed = n.RESPONSE.recordsets[0][0]
        if (this.roleTypeUser ==3) {
            
            

            if (localStorage.getItem('group')==employed.departamento || this.departamentos?.includes(employed.departamento)) {
              this.MyForm.get('name')?.setValue(`${employed.nombreE} ${employed.apellidoP} ${employed.apellidoM}`)
              this.MyForm.get('group')?.setValue(`${employed.departamento}`)
            }
            else{
              this.Toast.fire({
                position: 'top-end',
                icon: 'warning',
                title: `no pertenece a tu departamento`,
              });
            }
        }
        else{
          this.MyForm.get('name')?.setValue(`${employed.nombreE} ${employed.apellidoP} ${employed.apellidoM}`)
          this.MyForm.get('group')?.setValue(`${employed.departamento}`)
        }
      

      },
      error: (e:any) => {
        this.MyForm.get('name')?.setValue(``)
        this.MyForm.get('group')?.setValue(``)
      }

    })

  }
  GetUsers() {
    this.service.Data<any>('reportsUsers').subscribe({
      next: (n:any) => {
        this.users = n['data']['result']
      }
    })
  }
  changeStateUser(user: any) {
    this.loading = true
    this.service.Delete(`usersdestroy/${user.id}`).subscribe({
      next: (n:any) => {
        this.service.setData({ crud: true });
        this.GetUsers()
        this.loading = false
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `se a cambiado el estado`,
        });
      },
      error:(e:any)=>{
        this.loading = false
       if (user.active ==1) {
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `el usuario tiene resguardos`,
        });
       }else{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `ha ocurrido un error`,
        });
       }
      }
    })
  }
  editUser(user: any) {
    this.openGroups = false

    console.warn(user)
    let array = [];
    if (user.departamentos) {
      array = user.departamentos.split(',');
    }

    this.resetListGroups()
    this.groupSelects =[]
    if (array.length>0) {
      array.forEach(element => {
        const foundIndex = this.groupsCopy.findIndex(item => item.departamento.includes(element));
        if (foundIndex !== -1) {
          this.groupsCopy[foundIndex].checked = 1;
          this.groupSelects.push(this.groupsCopy[foundIndex]);
        }
      });
    }
    // this.groupsCopy = this.groups.map((group) => {
    //   const newGroup = { ...group };
    //   newGroup.checked = 0; 
    //   return newGroup;
    // });  
    
    this.MyForm.get('id')?.setValue(user.id)
    this.action = false
    Object.keys(user).forEach(us => {
      if (us =='role') {
        this.MyForm.get(us)?.setValue(user['type_role'])
        this.indicateOption(user['type_role'])
        
        if (user['type_role']=="Enlace") {
          this.openGroups = true

        }
      }
      else{
        this.MyForm.get(us)?.setValue(user[us])
      }
    })
    this.visible = true
  }
  onSubmit() {
    this.loading = true
    let url = 'auth/register';
    if (!this.action) {
      url =`usersupdate`
    }
     let data: { [key: string]: any } = {};

    Object.keys(this.MyForm.controls).forEach(key => {
      if (key == 'role') {
        data[key] = this.roleUser
      } else {

        data[key] = this.MyForm.get(key)?.value;
      }
    });


    this.service.Post(url, data).subscribe({
      next: (n:any) => {
        this.GetUsers()
        this.service.setData({ crud: true });
        this.MyForm.reset()
        this.visible = false
        this.loading = false
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se ha ${url =='auth/register'?'insertado':'actualizado'} correctamente`,
        });
      },
      error: (e:any) => {
        this.GetUsers()
        this.MyForm.reset()
        this.visible = false
        this.loading = false
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: ` No se ha podido ${url =='auth/register'?'insertar':'actualizar'}`,
        });

      },
    })
  }
  onInputChangeReports(event: any) {
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.table.filterGlobal(inputValue, 'contains');
    }
  }
  searchGroups(event: any){
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.groupsCopy = this.listVerifyCheckeds;
      this.groupsCopy = this.listVerifyCheckeds.filter(option => option.departamento.toLowerCase().includes(event.target.value));

    }
  }
  reportGroup(user: any) {
    this.group = user.group
      this.service.Data<any>(`usersguards/guardsgroup/${user.group}`).subscribe({
        next:(n:any)=>{
          this.report =n['data']['result']
          this.dialogmodal = true

        },error:(e)=>{
          this.dialogmodal = true

        }
      })
    }
    exportExcel() {
      import('xlsx').then((xlsx) => {
        const columnKeys = this.exportColumns.map((column) => column.title);
  
        // Crear una copia de this.guards para no modificar el original directamente
        const modifiedGuards = this.report.map((guard: { [x: string]: any; }) => {
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
        this.saveAsExcelFile(excelBuffer, 'Resguardos');
      });
    }
    saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data,this.group + EXCEL_EXTENSION);
    }
    getWidthPercentage(): string {
      const innerWidth = window.innerWidth;
      return innerWidth < 1025 ? '100vw' : '60vw';
    }
    
    getHeightPercentage(): string {
      const innerWidth = window.innerWidth;
      return innerWidth < 1025 ? '100vh' : '100vh';
    }
    GetNameUser(event: any) {
      this.MyForm.get('name')?.setValue(``)
      this.MyForm.get('group')?.setValue(``)
      this.MyForm.get('payroll')?.setValue(``)
      this.names =this.namesafter;
      this.names = this.names.filter(option => option.nombre.toLowerCase().includes(event.target.value));
    }
    groupSelected(group: any) {
      const index = this.groupsCopy.findIndex((item) => item.departamento === group.departamento);

      const existIndex = this.groupSelects.findIndex((item) => item.departamento === group.departamento);
      if (existIndex !== -1) {
        this.groupSelects.splice(existIndex, 1);
      } else {
        this.listVerifyCheckeds[index].checked = 1;
        this.groupSelects.push(group);
      }
      this.MyForm.get("groups")?.setValue(this.groupSelects);
    }
    
}
