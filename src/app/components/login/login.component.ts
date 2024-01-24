import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
  constructor(private Http:ServiceService<any>,private router: Router){

  }
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
  myForm!: FormGroup;
  createLoginForm() {
    this.myForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required,Validators.email]),
        password: new FormControl('', [Validators.required])

      }
    )
  }
  ngOnInit(): void {

      this.createLoginForm()




  }

  onSubmit() {

  this.Http.Post<any>("auth/login",this.myForm.value).subscribe({
    next:(n:any)=>{
      localStorage.setItem("token",n["data"]["result"]["token"])
      localStorage.setItem("role",n["data"]["result"]["user"]["role"])
      localStorage.setItem("id",n["data"]["result"]["user"]["id"])
      localStorage.setItem("group",n["data"]["result"]["user"]["group"])

      const id =n["data"]["result"]["user"]["id"]


            if (parseInt(n["data"]["result"]["user"]["role"])==4) {
              this.router.navigateByUrl(`/ResguardosUsuarios/${id}`)
            }else{
              this.router.navigateByUrl('/Usuarios');
            }






    },
    error:(e:any)=>{
      this.Toast.fire({
        position: 'top-end',
        icon: 'error',
        title: `Credenciales incorrectas.`,
      });
    },
    complete :()=>{

    }
  })
  }
}
