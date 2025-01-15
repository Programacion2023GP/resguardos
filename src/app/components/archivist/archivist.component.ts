import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { PrintkorimaComponent } from '../printkorima/printkorima.component';
import { DialogService } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archivist',
  templateUrl: './archivist.component.html',
  styleUrls: ['./archivist.component.css']
})
export class ArchivistComponent implements OnInit {
  korima :any[] = []
  roleTypeUser:any = localStorage.getItem('role')
  users:any[]=[]
  dataApiResguardos =[]
  data:any[] = []
  dataApiKorima=[]
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  headers = ['Imagen resguardo', 'Imagen con etiqueta', 'Numero de etiqueta', 'Nombre o descripción', 'marca y modelo', 'Numero serial', 'Estatus', 'ubicación', 'fecha de asignación del resguardo', 'Observaciones','Acciones']
  loading:boolean=false
  constructor(private service:ServiceService<any>,private dialogService: DialogService) { 
    this.roleTypeUser = parseInt(this.roleTypeUser)
    this.roleTypeUser== 3 && this.headers.unshift('Resguardante')

  }
  GetUsers(role:any = null){
    this.service.Data<any>(`users${role != null ? `/${role}` : ''}`).subscribe({
      next:(n:any)=>{
       const copyKorima = this.data
       this.korima = []
        this.users = n['data']['result']
        const payrolls = this.users.filter(item => item.payroll).map(item => item.payroll)
        copyKorima.map((item:any) =>{
          if (payrolls.includes(parseInt(item.Clave)) && item.motive_down && !item.autorized) {
             this.korima.push(item)
            
          }else{

          }
        })
        this.loading = false
      },
      error:(e)=>{
        this.loading = false

      }
    })
  }
  ngOnInit() {
 
  this.prueba()

  }
  addRow(): boolean {
    let row = false;
    const role = localStorage.getItem('role'); // Obtenemos el valor del localStorage

    // Verificamos si el valor no es null y luego lo convertimos a entero
    if (role !== null) {
        row = parseInt(role, 10) === 3; // Comparamos con 3
    }

    return row; // Retornamos el resultado
}
authorize(row){
  this.service.Post("korima/autorized",{id: row.idResguardos}).subscribe({
    next:(n)=>{
      this.Toast.fire({
        position: 'top-end',
        icon:'success',
        title: 'la baja se a enviado a patrimonio',
      });
      this.prueba()
    },error:(e)=>{
      this.Toast.fire({
        position: 'top-end',
        icon:"error",
        title:'no se puede dar de baja',
      });
    }
  })

}
  prueba() {
    this.loading = true

      this.service.OtherData<any>(`https://predial.gomezpalacio.gob.mx:4433/api/vistakorima`).subscribe({
      next: (n: any) => {
      this.dataApiKorima= n
       this.getKorima(n)

      },
      error:(e)=>{
        this.korima = [];
        this.loading = false

      }
    })
    }
    getKorima(n:any) {
      const role = localStorage.getItem('role'); // Obtenemos el valor del localStorage

      this.service.Data<any>('korima').subscribe({
          next: (n:any) => {
              const newData: any[] = [];
              this.dataApiResguardos = n['data']['result'];
  
              // Log para verificar el contenido de this.dataApiResguardos
             
              this.dataApiKorima.forEach((item: any) => {
                  // Verifica si existe al menos un elemento en this.dataApiResguardos que coincida
                  const exists = this.dataApiResguardos.some((element: any) => element?.korima == item?.NumeroEconomicoKorima);
                  if (exists) {
                    
                      const it: any = this.dataApiResguardos.filter((element: any) => element?.korima == item?.NumeroEconomicoKorima);
  
                      if (it.length > 0) {
                      
                          
                        item.picture = it[0].picture || "";
                          item.tag_picture = it[0].tag_picture || "";
                          item.motive_down = it[0].motive_down || null;
                          item.observation = it[0].observation || "";
                          item.idResguardos = it[0].id || "";
                          item.autorized = it[0].autorized || false;

                      }
                  } else {
                      item.picture = null;
                      item.tag_picture = null;
  
                      item.observation = "";
                      item.idResguardos = null;
  
                  }
  
                  item.existe = exists;
                  if(role!==null){
                    if( parseInt(role,10)==3 && item.motive_down){
                       
                      newData.push(item);
                    }
                    else if( parseInt(role,10) !=3 && item.motive_down && item.autorized){
                      newData.push(item);
  
                    }
                    else if(item.motive_down) {
                      console.log("d",item)
                    }
                  }
              });
              this.data = newData;
              if (role !== null) {
                
                if(parseInt(role,10) ==3){
                  
                  this.GetUsers()
                }
                else{
                  this.korima = newData;
                  
                this.loading = false
              }
            }else{
              this.korima = newData;

                this.loading = false
              }
            

          },
      });
  }
  expandImage = ""
  zoomIn(id:string,picture:string){
    this.expandImage =picture
  }
  zoomOut(id:string,picture:string){
    this.expandImage =""


  }
  Print(item) {
    this.service.setData({
     item
    })
  
    const ref = this.dialogService.open(PrintkorimaComponent, {
      width: '70%',
      height: '100%',
      contentStyle: {'max-height': '100%', 'overflow': 'auto'}
    });
  
    }
}

