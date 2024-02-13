import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { fadeInOutAnimation } from 'src/app/components/animations/animate';
import { Table } from 'jspdf-autotable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css'],
  animations:[fadeInOutAnimation]
})
export class StatesComponent {

@ViewChild('dt') table!: Table;
MyForm!: FormGroup;

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
visible!: boolean;
states!: any[];
constructor(private service:ServiceService<any>){
  this.Data()
    this.MyForm = new FormGroup({
    id:new FormControl(''),
    name:new FormControl('',Validators.required)
  })
}
removeState(id){
  this.service.Delete(`states/destroy/${id}`).subscribe({
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
edit(state: any) {
  this.visible = true
this.action = false
this.MyForm.get('id')?.setValue(state.id)
Object.keys(state).forEach(key => {
  if (this.MyForm.get(key)) {
    this.MyForm.get(key)?.setValue(state[key]);
  }
});}
onInputChangeReports($event: Event) {
throw new Error('Method not implemented.');
}
showDialog() {
  this.MyForm.reset()

  this.action = true

this.visible = true
}
getWidthPercentage(): string {
  const innerWidth = window.innerWidth;
  return innerWidth < 1025 ? '100vw' : '40vw';
}

getHeightPercentage(): string {
  const innerWidth = window.innerWidth;
  return innerWidth < 1025 ? '100vh' : '25vh';
}
Data(){
  this.service.Data<any>("states").subscribe({
    next:(n)=>{
      this.states = n['data']['result']
    }
  })
}
onSubmit() {
  let url = 'states'
    if (!this.action) {
      url = 'states/update'
    }
  
  this.service.Post(url,this.MyForm.value).subscribe({
    next:(n)=>{
      this.Data()
      this.Toast.fire({
        position: 'top-end',
        icon: 'success',
        title: `Se ha ${url =='states'?'insertado':'actualizado'} correctamente`,
      });
      this.visible = false
    },
    error:(e)=>{
      this.Toast.fire({
        position: 'top-end',
        icon: 'error',
        title: ` No se ha podido ${url =='states'?'insertar':'actualizar'} correctamente`,
      });
      this.visible = false

    }
  })
}
}
