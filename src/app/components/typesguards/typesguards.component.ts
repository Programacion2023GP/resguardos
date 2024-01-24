import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ServiceService } from 'src/app/service.service';
import Swal from 'sweetalert2'
import { fadeInOutAnimation } from 'src/app/components/animations/animate';

@Component({
  selector: 'app-typesguards',
  templateUrl: './typesguards.component.html',
  styleUrls: ['./typesguards.component.css'],
  animations:[fadeInOutAnimation]
})
export class TypesguardsComponent {
  @ViewChild('dt') table!: Table;

visible!: boolean;
MyForm!: FormGroup;
typesGuards: any;
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
  action!: Boolean;
  animationState: string = 'start';
constructor(private service:ServiceService<any>){
  this.Data()
  this.MyForm = new FormGroup({
    id:new FormControl(''),
    name:new FormControl('',Validators.required)
  })
  
}
Data(){
  this.service.Data<any>("types").subscribe({
    next:(n)=>{
      this.typesGuards = n['data']['result']
    }
  })
}
onSubmit() {
  let url = 'types'
    if (!this.action) {
      url = 'types/update'
    }

  this.service.Post(url,this.MyForm.value).subscribe({
    next:(n)=>{
      this.Data()
      this.Toast.fire({
        position: 'top-end',
        icon: 'success',
        title: `Se ha ${url =='types'?'insertado':'actualizado'} correctamente`,
      });
      this.visible = false
    },
    error:(e)=>{
      this.Toast.fire({
        position: 'top-end',
        icon: 'error',
        title: ` No se ha podido ${url =='types'?'insertar':'actualizar'} correctamente`,
      });
      this.visible = false

    }
  })
}
removeType(id){
  this.service.Delete(`types/destroy/${id}`).subscribe({
    next:(n)=>{
      this.Data()
      this.Toast.fire({
        position: 'top-end',
        icon: 'success',
        title: `Se ha eliminado correctamente`,
      });
    },
    error:(e)=>{

      this.Toast.fire({
        position: 'top-end',
        icon: 'error',
        title: e['error']['data']['message'] || 'No se ha podido eliminar el tipo',
    });
    

     
    }
  })
}
showDialog(){
  this.MyForm.reset()
  this.action = true
  this.visible = true

}
edit(type:any){
  this.visible = true
this.action = false
this.MyForm.get('id')?.setValue(type.id)
Object.keys(type).forEach(key => {
  if (this.MyForm.get(key)) {
    this.MyForm.get(key)?.setValue(type[key]);
  }
});
}
onInputChangeReports(event: any) {
  if (event && event.target) {
    // Ahora TypeScript sabe que event.target no es nulo
    const inputValue: string = event.target.value;
    this.table.filterGlobal(inputValue, 'contains');
  }
}
getWidthPercentage(): string {
  const innerWidth = window.innerWidth;
  return innerWidth < 1025 ? '100vw' : '40vw';
}

getHeightPercentage(): string {
  const innerWidth = window.innerWidth;
  return innerWidth < 1025 ? '100vh' : '25vh';
}
}
