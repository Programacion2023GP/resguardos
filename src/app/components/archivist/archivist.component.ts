import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { PrintkorimaComponent } from '../printkorima/printkorima.component';
import { DialogService } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archivist',
  templateUrl: './archivist.component.html',
  styleUrls: ['./archivist.component.css'],
})
export class ArchivistComponent implements OnInit {
  korima: any[] = [];
  roleTypeUser: any = localStorage.getItem('role');
  users: any[] = [];
  dataApiResguardos = [];
  data: any[] = [];
  dataApiKorima = [];
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
  headers = [
    'Imagen resguardo',
    'Imagen con etiqueta',
    'Numero de etiqueta',
    'Nombre o descripción',
    'marca y modelo',
    'Numero serial',
    'Estatus',
    'ubicación',
    'fecha de asignación del resguardo',
    'Observaciones',
    'Motivo de baja',
    'Motivo de transferencia',
    'motivo de cancelación',
    'Acciones',
  ];
  loading: boolean = false;
  constructor(
    private service: ServiceService<any>,
    private dialogService: DialogService
  ) {
    this.roleTypeUser = parseInt(this.roleTypeUser);
    this.roleTypeUser == 3 && this.headers.unshift('Resguardante');
  }
  GetUsers(role: any = null) {
    this.service.Data<any>(`users${role != null ? `/${role}` : ''}`).subscribe({
      next: (n: any) => {
        const copyKorima = this.data;
        this.korima = [];
        this.users = n['data']['result'];

        const payrolls = this.users
          .filter((item) => item.payroll)
          .map((item) => item.payroll);
        copyKorima.forEach((item: any) => {
          // 🔹 Cambiado de map() a forEach()
          if (
            payrolls.includes(Number(item.Clave)) &&
            item.motive_down &&
            !item.autorized
          ) {
            this.korima.push(item);
          }
        });
        this.korima = this.korima.sort((a, b) => b.id - a.id);
        this.korimaCopy = this.korima;

        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.prueba();
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
  authorize(row, option: number) {
    let motivo: string | null = null; // Variable para almacenar el motivo de cancelación

    if (!this.addRow() && option === 0) {
      Swal.fire({
        title: 'Motivo de cancelación',
        input: 'textarea',
        inputPlaceholder: 'Escribe el motivo',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Es necesario proporcionar un motivo!'; // Si no hay valor, mostrar mensaje de error
          }
          return null; // Si la validación pasa, no hay errores
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          motivo = result.value; // Guardamos el motivo

          // Ahora realizamos la solicitud con el motivo incluido
          this.sendRequest(row, option, motivo);
        }
      });
    } else {
      // Si no es necesario pedir el motivo
      this.sendRequest(row, option, motivo);
    }
  }
  korimaCopy: any = [];
  filterByColor(event: any): void {
    const filterValue = event.target.value; // Obtiene el valor seleccionado
    let newData:Array<Record<string,any>> =[]
    // Filtra según la opción seleccionada
    if (filterValue === 'all') {
      newData = this.korimaCopy.sort((a, b) => b.id - a.id);
    } else if (filterValue === 't') {
      newData = this.korimaCopy.filter((item) => item.trauser_id);
    } else if (filterValue === 'b') {
      newData = this.korimaCopy.filter((item) => !item.trauser_id);
    } else if (filterValue === 'ta') {
      newData = this.korimaCopy.filter(
        (item) => item.archivist == 1 && item.trauser_id
      );
    } else if (filterValue === 'tc') {
      newData = this.korimaCopy.filter(
        (item) => item.archivist == 0 && item.trauser_id
      );
    } else if (filterValue === 'tp') {
      newData = this.korimaCopy.filter(
        (item) => item.archivist == null && item.trauser_id
      );
    } else if (filterValue === 'ba') {
      newData = this.korimaCopy.filter(
        (item) => item.archivist == 1 && !item.trauser_id
      );
    } else if (filterValue === 'bc') {
      newData = this.korimaCopy.filter(
        (item) => item.archivist == 0 && !item.trauser_id
      );
    } else if (filterValue === 'bt') {
      newData = this.korimaCopy.filter(
        (item) => item.archivist == null && !item.trauser_id
      );
    }


    this.korima = newData
    .filter((item) => item['updated_at'])  // Usar notación de corchetes
    .sort((a, b) => 
      new Date(b['updated_at']).getTime() - new Date(a['updated_at']).getTime()  // Usar notación de corchetes
    );
  
  
    
    // else if (filterValue === 'green') {
    //   this.korima = this.korimaCopy.filter((item) => item.archivist == 1);
    // } else if (filterValue === 'red') {
    //   this.korima = this.korimaCopy.filter((item) => item.archivist == 0);
    // }

    // Muestra el resultado filtrado en la consola
  }
  sendRequest(row, option: number, motivo: string | null) {
    const payload = { id: row.idResguardos, option: option };

    // Si existe motivo, lo añadimos al payload
    if (motivo) {
      payload['motivearchivist'] = motivo;
    }

    this.service.Post('korima/autorized', payload).subscribe({
      next: (n) => {
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `${
            option == 1
              ? 'La baja se ha enviado a patrimonio'
              : 'Se ha rechazado la baja'
          }`,
        });
        this.prueba();
      },
      error: (e) => {
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `${
            option == 1
              ? 'No se puede dar de baja'
              : 'No se pudo cancelar la baja'
          }`,
        });
      },
    });
  }
  prueba() {
    this.loading = true;

    this.service
      .OtherData<any>(
        `https://predial.gomezpalacio.gob.mx:4433/api/vistakorima`
      )
      .subscribe({
        next: (n: any) => {
          this.dataApiKorima = n;
          this.getKorima(n);
        },
        error: (e) => {
          this.korima = [];
          this.loading = false;
        },
      });
  }
  getKorima(n: any) {
    const role = localStorage.getItem('role'); // Obtenemos el valor del localStorage

    this.service.Data<any>('korima').subscribe({
      next: (n: any) => {
        const newData: any[] = [];
        this.dataApiResguardos = n['data']['result'];

        // Log para verificar el contenido de this.dataApiResguardos

        this.dataApiKorima.forEach((item: any) => {
          // Verifica si existe al menos un elemento en this.dataApiResguardos que coincida
          const exists = this.dataApiResguardos.some(
            (element: any) => element?.korima == item?.NumeroEconomicoKorima
          );
          if (exists) {
            const it: any = this.dataApiResguardos.filter(
              (element: any) => element?.korima == item?.NumeroEconomicoKorima
            );
            if (it.length > 0) {
              item.picture = it[0].picture || '';
              item.tag_picture = it[0].tag_picture || '';
              item.motive_down = it[0].motive_down || null;
              item.observation = it[0].observation || '';
              item.idResguardos = it[0].id || '';
              item.autorized = it[0].autorized || false;
              item.trauser_id = it[0].trauser_id || null;
              item.motivetransfer = it[0].motivetransfer || null;
              item.archivist = it[0].archivist;
              item.motivearchivist = it[0].motivearchivist;
              item.updated_at = it[0].updated_at;
            }
          } else {
            item.picture = null;
            item.tag_picture = null;

            item.observation = '';
            item.idResguardos = null;
          }

          item.existe = exists;
          if (role !== null) {
            if (parseInt(role, 10) == 3 && item.motive_down) {
              newData.push(item);
            } else if (
              parseInt(role, 10) != 3 &&
              item.motive_down &&
              item.autorized
            ) {
              newData.push(item);
            } else if (item.motive_down) {
            }
          }
        });
        this.data = newData.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        if (role !== null) {
          if (parseInt(role, 10) == 3) {
            this.GetUsers();
          } else {
            this.korima = newData.sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            );

            this.korimaCopy = newData.sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            );

            this.loading = false;
          }
        } else {
          this.korima = newData.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );

          this.korimaCopy = newData.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );

          this.loading = false;
        }
      },
    });
  }
  expandImage = '';
  zoomIn(id: string, picture: string) {
    this.expandImage = picture;
  }
  zoomOut(id: string, picture: string) {
    this.expandImage = '';
  }
  Print(item) {
    this.service.setData({
      item,
    });

    const ref = this.dialogService.open(PrintkorimaComponent, {
      width: '70%',
      height: '100%',
      contentStyle: { 'max-height': '100%', overflow: 'auto' },
    });
  }
}
