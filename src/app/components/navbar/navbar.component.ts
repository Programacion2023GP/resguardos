import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { ServiceService } from 'src/app/service.service';
import { repeatfadeInOutAnimation } from 'src/app/components/animations/animate';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [repeatfadeInOutAnimation],
})
export class NavbarComponent {
  timeDay: Boolean = false;
  isAnimateMenu: Boolean = false;
  items: MenuItem[] | undefined;
  isExpanded = false;
  idUserZoom:number|null=null
  roleTypeUser: any = localStorage.getItem('role');
  users: any[] = [];
  listUsers: any[] = [];
  nomina: string | null = '';
  payroll: string | null = '';
  selectedItem: string | null = '';
  selectedUser: Boolean[] = [true, false, false, false];
  selectedItemMenu: Boolean[] = [
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  selected: any;
  animationState!: string;
  openFolder: string = ''; // Estado para saber si el dropdown está abierto o cerrado
  menuItems = [
    {
      title: 'Sistema de Control',
      subItems: [
        {
          id: 1,
          name: 'Gestión de Usuarios',
          link: '/Usuarios',
          icon: 'fas fa-users',
          permised: [1, 2,3],
        },
        {
          id: 1,
          name: 'Resguardos Control',
          link: `/ResguardosUsuarios/${localStorage.getItem('id')}`,
          icon: 'fas fa-users',
          permised: [4],
        },
        // {
        //   id: 2,
        //   name: 'Registro de resguardos de control',
        //   link: '/Resguardos',
        //   icon: 'fas  fa-folder-open',
        //   permised: [1, 2, 3],
        // },
        {
          title: 'Catalogos',
          subItems: [
            {
              id: 1,
              name: 'Tipos de resguardo',
              link: '/TiposResguardos',
              icon: 'fas fa-users',
              permised: [1, 2],
            },
            {
              id: 2,
              name: 'Estado fisico',
              link: '/Estados',
              icon: 'fas fa-folder-open',
              permised: [1, 2],
            },
            {
              id: 3,
              name: 'Registro de resguardos',
              link: '/Resguardos',
              icon: 'fas  fa-folder-open',
              permised: [1, 2, 3],
            },
            // Agregar más elementos aquí si es necesario
          ],
        },
        {
          title: 'Reportes',
          subItems: [
            {
              id: 3,
              name: 'Graficas de control',
              link: '/Graficas',
              icon: 'fas fa-chart-bar',
              permised: [1, 2],
            },
            // {
            //   id: 4,
            //   name: 'Reporte de Imágenes Korima',
            //   link: '/ReporteKorima',
            //   icon: 'fas fa-file-alt',
            //   permised: [1, 2],
            // },
            {
              id: 5,
              name: 'Total | articulos x departamento',
              link: '/Reportedepartamentos',
              icon: ' fas fa-file-alt',
              permised: [1, 2],
            },

            // Agregar más elementos aquí si es necesario
          ],
        },
      ],
    },

    {
      title: 'Resguardos de Korima',
      subItems: [
        {
          id: 6,
          name: 'Resguardos',
          link: `/Korima/${localStorage.getItem('nomina')}`,
          icon: ' fas fa-user-shield',
          permised: [4],
        },
        {
          id: 7,
          name: 'Oficios de baja',
          link: '/Archivos',
          icon: ' fas fa-user-shield',
          permised: [1, 2],
        },
        {
          id: 8,
          name: 'Autorizar bajas',
          link: '/Archivos',
          icon: ' fas fa-check-circle',
          permised: [3],
        },
        {
          title: 'Reportes',
          subItems: [
            {
              id: 4,
              name: 'Estatus por Dep-Usuarios',
              link: '/ReporteKorima',
              icon: 'fas fa-file-alt',
              permised: [1, 2],
            },

            // Agregar más elementos aquí si es necesario
          ],
        },
      ],
    },
  ];
  hasPermission(subItems: any[]): boolean {
    return subItems.some((subItem) => {
     
      
      // Verificar que permised es un arreglo
      if (Array.isArray(subItem.permised)) {
        return subItem.permised.includes(this.roleTypeUser);
      }
      
      return false;
    });
  }
  
  
  ngOnInit(): void {
    // Detect changes in the route
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd) // Filter out the NavigationEnd events
      )
      .subscribe(() => {
        // Update the selected item whenever the route changes
        this.updateSelectedItem();
      });

    // Also run it on initialization to handle the initial route
    this.updateSelectedItem();
  }

  // Method to update the selected item based on the current route
  updateSelectedItem(): void {
    const currentUrl = window.location.hash.split("/")[1]; // Obtén la primera parte de la ruta después del hash
  
    const findSelectedItem = (items: any[]): any => {
      for (let item of items) {
        const itemLink = item.link?.split("/")[1]; // Obtén solo la primera parte del link del item
  
        if (itemLink && currentUrl === itemLink) {
          return item; // Retorna el elemento si coincide con la ruta
        }
  
        if (item.subItems && item.subItems.length > 0) {
          const found = findSelectedItem(item.subItems); // Busca recursivamente en los submenús
          if (found) return found;
        }
      }
      return null; // Retorna null si no se encuentra ningún elemento
    };
  
    const selected = findSelectedItem(this.menuItems);
    this.selectedItem = selected ? selected.name : null; // Actualiza el ítem seleccionado
  }
  

  changeItemSelected(selected: string): void {
    // Reset selectedItemMenu when a new item is selected
    for (let i = 0; i < this.selectedItemMenu.length; i++) {
      this.selectedItemMenu[i] = false;
    }
    this.selectedItem = selected; // Update the selectedItem variable when a new item is clicked
  }

  // Method to update the selected item based on the current route

  constructor(
    private service: ServiceService<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.GetUsers();
    this.payroll = localStorage.getItem('nomina');

    this.roleTypeUser = parseInt(this.roleTypeUser);
    this.service.data$.subscribe((data: any) => {
      this.nomina = localStorage.getItem('id');

      this.GetUsers();
    });
  }
  toggleDropdown(name: string): void {
    this.openFolder = name; // Cambiar el estado al hacer clic
  }
  changeTimeday() {
    if (this.isExpanded) {
      this.isExpanded = false;
    }
    this.timeDay = !this.timeDay;
    console.log('time', this.timeDay);
  }

  GetUsers(role: any = null) {
    this.playAnimation();
    this.service.Data<any>(`users${role != null ? `/${role}` : ''}`).subscribe({
      next: (n: any) => {
        this.listUsers = n['data']['result'];

        this.users = n['data']['result'];
      },
    });
  }
  playAnimation() {
    this.animationState = this.animationState === 'start' ? 'end' : 'start';
  }
  selectedEmployed(index: number) {
    this.selected = index;
  }
  toggleContent(): void {
    this.isExpanded = !this.isExpanded;
  }
  changeUserSelected(selected: number): void {
    for (let i = 0; i < this.selectedUser.length; i++) {
      this.selectedUser[i] = false;
    }
    this.selected = null;
    this.selectedUser[selected] = true;
    if (selected + 1 > 1) {
      this.GetUsers(selected + 1);
    } else {
      this.GetUsers();
    }
  }

  Logout() {
    this.service
      .Logout('auth/logout')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Manejo específico para el error 401
            // Por ejemplo, redirigir a la página de inicio de sesión o mostrar un mensaje al usuario
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('role');

            this.router.navigateByUrl('');
            console.log('Error 401: No autorizado');
          }
          // Propagar el error para que sea manejado en otras partes de la aplicación si es necesario
          return throwError(error);
        })
      )
      .subscribe({
        next: (n: any) => {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('role');

          this.router.navigateByUrl('');
        },
        error: (e: any) => {},
      });
  }
  searchUser(event: any) {
    this.selected = null;

    if (event.target.value.length > 1) {
      const searchTerm = event.target.value.toLowerCase();

      this.users = this.listUsers.filter((u) => {
        const isNameMatch =
          typeof u.name === 'string' &&
          u.name.toString().toLowerCase().includes(searchTerm);
        const isPayrollMatch =
          typeof u.payroll === 'number' &&
          u.payroll.toString().toLowerCase().includes(searchTerm);

        return isNameMatch || isPayrollMatch;
      });
    } else {
      this.users = this.listUsers;
    }
  }
  zoomIn(id:number){
    this.idUserZoom=id
  }
  zoomOut(id:number){

    this.idUserZoom=null

  }
}
