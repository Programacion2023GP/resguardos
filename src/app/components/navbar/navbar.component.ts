import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { ServiceService } from 'src/app/service.service';
import {  repeatfadeInOutAnimation  } from 'src/app/components/animations/animate';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations:[repeatfadeInOutAnimation]
})
export class NavbarComponent {
  timeDay:Boolean = false
  isAnimateMenu:Boolean = false
  items: MenuItem[] | undefined;
  isExpanded = false;
  roleTypeUser:any = localStorage.getItem('role')
  users: any[]=[];
  listUsers:any[]=[]
  selectedUser:Boolean[]=[
  true, false,false,false
  ];
  selectedItemMenu:Boolean[]=[
    false, true, false,false,false
  ]
selected: any;
animationState !:string; 
constructor(private service:ServiceService<any>,private router: Router){
    this.GetUsers()
    this.roleTypeUser = parseInt(this.roleTypeUser)
    this.service.data$.subscribe((data:any) => {

     this.GetUsers()
    });
  }
  changeTimeday() {
    if (this.isExpanded) {
        this.isExpanded = false
    }
    this.timeDay = !this.timeDay;
    console.log("time", this.timeDay);
  }

  GetUsers(role:any = null){
    this.playAnimation()
    this.service.Data<any>(`users${role != null ? `/${role}` : ''}`).subscribe({
      next:(n:any)=>{
        this.listUsers = n['data']['result']

        this.users = n['data']['result']

      }
    })
  }
  playAnimation() {
    this.animationState = (this.animationState === 'start') ? 'end' : 'start';
  }
  selectedEmployed(index:number){
    this.selected = index
  }
  toggleContent(): void {
    this.isExpanded = !this.isExpanded;
  }
  changeUserSelected(selected:number): void {
    for (let i = 0; i < this.selectedUser.length; i++) {
      this.selectedUser[i]=false;

    }
    this.selected = null
    this.selectedUser[selected] = true;
    if (selected +1>1) {
      this.GetUsers(selected +1)
    }
    else{
      this.GetUsers()
    }

  }
  changeItemSelected(selected:number): void {
    for (let i = 0; i < this.selectedItemMenu.length; i++) {
      this.selectedItemMenu[i]=false;

    }

    this.selectedItemMenu[selected] = true;
    this.selected = null
  }
  Logout() {
  this.service.Logout('auth/logout').pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Manejo específico para el error 401
        // Por ejemplo, redirigir a la página de inicio de sesión o mostrar un mensaje al usuario
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        localStorage.removeItem('role')

        this.router.navigateByUrl('');
        console.log('Error 401: No autorizado');
      }
      // Propagar el error para que sea manejado en otras partes de la aplicación si es necesario
      return throwError(error);
    })
    )
  .subscribe({
    next:(n:any)=>{
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      localStorage.removeItem('role')

      this.router.navigateByUrl('');

    },
    error:(e:any)=>{

    }
  })
  }
  searchUser(event:any) {
    this.selected = null;

    if (event.target.value.length > 1) {
      const searchTerm = event.target.value.toLowerCase();
    
      this.users = this.listUsers.filter(u => {
        const isNameMatch = typeof u.name === 'string' && u.name.toString().toLowerCase().includes(searchTerm);
        const isPayrollMatch = typeof u.payroll === 'number' && u.payroll.toString().toLowerCase().includes(searchTerm);
        
        return isNameMatch || isPayrollMatch;
      });
  
    } else {
      this.users = this.listUsers;
    }
    
   
    }
}

