import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import FileSaver from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { DialogService } from 'primeng/dynamicdialog';
import { UserprintresguardsactiveComponent } from '../userprintresguardsactive/userprintresguardsactive.component';
import { repeatfadeInOutAnimation } from 'src/app/components/animations/animate';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UnsuscribeguardsComponent } from 'src/app/componets/unsuscribeguards/unsuscribeguards.component';
import { ReportceticComponent } from '../reportcetic/reportcetic.component';

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
  id: number;
  text: string;
}
interface Item {
  stock_number: string;
  description: string;
  brand: string;
  type: string;
  serial: string;
  state: string;
  airlane: string;
  group: string;
  dateup: string;
  datedown: string;
  used: number;
  // ... otros campos
}

@Component({
  selector: 'app-korima',
  templateUrl: './korima.component.html',
  styleUrls: ['./korima.component.css'],
  animations: [repeatfadeInOutAnimation],
})
// ServiceService
export class KorimaComponent implements OnInit {
  descripcion: any;
  imagen: any;
  tag_picture: any;
  users: Array<Record<string, any>> = [];

  korima: any[] = [];
  empleado: number | null = 0;
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]; // Captura el archivo seleccionado
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos de archivo permitidos

      const maxSizeInMB = 4; // Establece el tamaño máximo en MB (2MB en este caso)
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convierte a bytes
      if (validTypes.includes(file.type) && file.size <= maxSizeInBytes) {
        this.imagen = file; // Asigna el archivo si es válido
      }
      // Verifica si el archivo supera el tamaño máximo permitido
      if (file.size <= maxSizeInBytes) {
        this.imagen = file; // Asigna el archivo si es válido
      } else {
        if (!validTypes.includes(file.type)) {
          this.Toast.fire({
            position: 'top-start',
            icon: 'success',
            title: `Por favor, selecciona un archivo de imagen válido (JPEG, PNG).`,
          });
        } else {
          this.Toast.fire({
            position: 'top-start',
            icon: 'success',
            title: `El archivo no puede exceder los ${maxSizeInMB}MB.`,
          });
        }
        this.tag_picture = null; // Resetea si no es válido
      }

      // else {
      //   this.Toast.fire({
      //     position: 'top-start',
      //     icon:'success',
      //     title: `El archivo no puede exceder los ${maxSizeInMB}MB.`,
      //   });
      //   this.imagen = null; // Resetea si el archivo es demasiado grande
      // }
    }
  }
  onFileChange2(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]; // Captura el archivo seleccionado

      const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos de archivo permitidos
      const maxSizeInMB = 4; // Establece el tamaño máximo en MB (2MB en este caso)
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convierte a bytes

      // Verifica el tipo de archivo y el tamaño
      if (validTypes.includes(file.type) && file.size <= maxSizeInBytes) {
        // console.log('imagen 2',this.tag_picture)
        this.tag_picture = file; // Solo asigna si el tipo y el tamaño son válidos
      } else {
        if (!validTypes.includes(file.type)) {
          this.Toast.fire({
            position: 'top-start',
            icon: 'success',
            title: `Por favor, selecciona un archivo de imagen válido (JPEG, PNG).`,
          });
        } else {
          this.Toast.fire({
            position: 'top-start',
            icon: 'success',
            title: `El archivo no puede exceder los ${maxSizeInMB}MB.`,
          });
        }
        this.tag_picture = null; // Resetea si no es válido
      }
    }
  }
  GetUsers() {
    this.service.Data<any>(`userslist`).subscribe({
      next: (n: any) => {
        this.users = n['data']['result'];
      },
      error: (n: any) => {},
    });
  }
  changeGuard(guard: any) {
    Swal.fire({
      title: 'Transferencia de resguardo',
      text: 'Selecciona un usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',

      html: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative; width: 100%; height:300px;">
  <input type="text" id="searchUser" class="swal2-input" placeholder="Buscar usuario" style="width: 95%; text-align: left; padding: 12px; font-size: 16px;">
  <div id="autocompleteList" style="
      width: 95%;
      max-height: 250px; /* Más alto */
      overflow-y: auto;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px; /* Bordes más suaves */
      position: absolute;
      top: 65px; /* Más abajo */
      left: 2.5%;
      z-index: 1000;
      display: none;
      padding: 10px; /* Espaciado interno */
  "></div>
</div>
<label class='w-full text-start text-lg font-bold'>Explica el porque la transferencia</label>
<textarea  id="downmotive" class="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" rows="4" placeholder="Escribe tu mensaje aquí..."  maxlength="90"></textarea>
<div id="charCount" style="text-align: right; width: 100%; font-size: 14px; color: #666;">90/90</div>
      `,
      didOpen: () => {
        const input = document.getElementById('searchUser') as HTMLInputElement;
        const textarea = document.getElementById('downmotive') as HTMLTextAreaElement;

        const charCount = document.getElementById('charCount') as HTMLDivElement;
        const updateCharCount = () => {
          const remainingChars = 90 - textarea.value.length;
          charCount.textContent = `${remainingChars}/90`;
        };
      
        textarea.addEventListener('input', updateCharCount);
        const listContainer = document.getElementById(
          'autocompleteList'
        ) as HTMLDivElement;
        let selectedIndex = -1; // Para navegación con teclado

        const updateList = (filter: string) => {
          const filteredUsers = this.users.filter((user: any) =>
            user.name.toLowerCase().includes(filter.toLowerCase())
          );

          listContainer.innerHTML = '';
          if (filteredUsers.length === 0) {
            listContainer.style.display = 'none';
            return;
          }

          filteredUsers.forEach((user: any, index: number) => {
            const item = document.createElement('div');
            item.textContent = user.name;
            item.setAttribute('data-id', user.id);
            item.style.padding = '8px';
            item.style.cursor = 'pointer';
            item.style.borderBottom = '1px solid #eee';

            item.addEventListener('click', () => {
              input.value = user.name;
              input.setAttribute('data-id', user.id);
              listContainer.style.display = 'none';
            });

            item.addEventListener('mouseenter', () => {
              selectedIndex = index;
              highlightItem();
            });

            listContainer.appendChild(item);
          });

          listContainer.style.display = 'block';
        };

        const highlightItem = () => {
          Array.from(listContainer.children).forEach((child, index) => {
            (child as HTMLElement).style.background =
              index === selectedIndex ? '#f0f0f0' : 'white';
          });
        };

        input.addEventListener('input', () => {
          selectedIndex = -1;
          updateList(input.value);
        });

        input.addEventListener('keydown', (e) => {
          const items = listContainer.children;
          if (e.key === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % items.length;
          } else if (e.key === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
          } else if (e.key === 'Enter' && selectedIndex !== -1) {
            (items[selectedIndex] as HTMLElement).click();
          }
          highlightItem();
        });

        document.addEventListener('click', (e) => {
          if (
            !input.contains(e.target as Node) &&
            !listContainer.contains(e.target as Node)
          ) {
            listContainer.style.display = 'none';
          }
        });
      },
      preConfirm: () => {
        const selectedUserId = (
          document.getElementById('searchUser') as HTMLInputElement
        ).getAttribute('data-id');

        if (!selectedUserId) {
          Swal.showValidationMessage('Debes seleccionar un usuario');
        }
        console.log('Selected user ID:', selectedUserId); // Depuración
        return selectedUserId;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const textaerea = (
          document.getElementById('downmotive') as HTMLInputElement
        ).value;
        console.log('aqui', textaerea);
        this.service
          .Post(`korima/transfer`, {
            ...result,
            ...guard,
            name: this.name,
            motivetransfer: textaerea,
          })
          .subscribe({
            next: (n: any) => {
              this.loading = false;
              this.data = n['data']['result'];
              Swal.fire(
                '¡Éxito!',
                'La transferencia fue solicitada.',
                'success'
              );
              this.prueba();
            },
            error: (n: any) => {
              this.loading = false;
            },
          });
      }
    });
  }

  // Método para manejar el submit del formulario
  onSubmit() {
    // Crear FormData para enviar los datos del formulario
    const formData = new FormData();

    const payroll = localStorage.getItem('payroll');

    if (payroll) {
      formData.append('payroll', payroll);
    }

    formData.append('id', this.idResguardo); // Agrega la imagen

    formData.append('korima', this.korimaNumber); // Agrega la imagen
    formData.append('picture', this.imagen); // Agrega la imagen
    formData.append('tag_picture', this.tag_picture); // Agrega la imagen

    this.descripcion && formData.append('observation', this.descripcion); // Agrega la descripción

    // Aquí puedes hacer la llamada a tu servicio para enviar los datos

    // Restablecer valores después del submit
    this.descripcion = '';
    this.imagen = null;
    this.tag_picture = null;

    this.visible = false;
    this.loading = true;
    this.service
      .Post(`${this.idResguardo ? 'korima/update' : 'korima'}`, formData)
      .subscribe({
        next: (n) => {
          this.Toast.fire({
            position: 'top-end',
            icon: 'success',
            title: `${
              this.idResguardo
                ? 'se ha actualizado correctamente'
                : 'se ha insertado correctamente'
            }`,
          });
          this.loading = false;
        },
        error: (e) => {
          this.Toast.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No se ha podido hacer la accion intente nuevamente',
          });
          this.loading = false;
        },
        complete: () => {
          this.descripcion = null;
          this.imagen = null;
          this.tag_picture = null;

          this.idResguardo = null;
          this.prueba();
          this.loading = false;

          // this.loading = false;
        },
      });
  }

  onInputChange(event: any) {
    if (event.target.value.length >= 4) {
      this.loading = true;
      this.service
        .OtherData<any>(
          `https://predial.gomezpalacio.gob.mx:4433/api/vistakorima/${event.target.value}`
        )
        .subscribe({
          next: (n: any) => {
            this.empleado = event.target.value;
            this.name =
              n[0].Nombres +
              ' ' +
              n[0].ApellidoPaterno +
              ' ' +
              n[0].ApellidoMaterno;
            this.group = n[0].NombreDepartamento;
            this.payroll = `${this.empleado}`;
            this.getKorima(n);
            this.loading = false;
          },
          error: (e) => {
            this.Toast.fire({
              position: 'top-end',
              icon: 'error',
              title: `si no te deja avanzar es posible que el numero de nomina no exista o no tiene ningun resguardo en korima`,
            });
            this.korima = [];
            this.service.Data<any>(`user/nomina/${this.empleado}`).subscribe({
              next: (n) => {
                const item = n['data']['result'][0];
                this.name = item.name;
                this.group = item.group;
                this.payroll = item.payroll;
                this.loading = false;
              },
              error: (e) => {
                this.loading = false;
              },
            });
          },
        });
    }
    // console.log('Input value:', event.target.value);
  }
  downKorima(id: number, korima: number, pass: boolean) {
    if (!pass) {
      this.Toast.fire({
        position: 'top-start',
        icon: 'error',
        title: `No se puede dar de baja sin las fotos del resguardo`,
      });
      return;
    }

    // Swal.fire({
    //   title: 'Motivo de baja',
    //   input: 'textarea',
    //   inputPlaceholder: 'Escribe el motivo de la baja...',
    //   showCancelButton: true,
    //   confirmButtonText: 'Confirmar',
    //   cancelButtonText: 'Cancelar',
    //   inputValidator: (value) => {
    //     if (!value) {
    //       return 'Por favor, escribe un motivo para continuar.';
    //     }
    //     return null;
    //   },
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     const motivo = result.value; // Obtén el motivo introducido por el usuario

    //     // Realiza la petición al servicio con el motivo
    //     this.service
    //       .Post<any>('korima/down', { id, motive_down: motivo, korima })
    //       .subscribe({
    //         next: (response) => {
    //           Swal.fire(
    //             '¡Éxito!',
    //             'La baja ha sido registrada correctamente.',
    //             'success'
    //           );
    //           this.prueba();
    //         },
    //         error: (error) => {
    //           Swal.fire(
    //             'Error',
    //             'Ocurrió un problema al dar de baja.',
    //             'error'
    //           );
    //         },
    //       });
    //   }
    // });
    Swal.fire({
      title: 'Motivo de baja',
      input: 'textarea',
      inputPlaceholder: 'Escribe el motivo de la baja...',
      inputAttributes: {
        maxlength: '90', // Limita el textarea a 90 caracteres
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, escribe un motivo para continuar.';
        }
        if (value.length > 90) {
          return 'El motivo no puede exceder los 90 caracteres.';
        }
        return null;
      },
      didOpen: () => {
        // Selecciona el textarea
        const textarea = document.querySelector('.swal2-textarea') as HTMLTextAreaElement;
    
        // Crea el contador de caracteres
        const charCount = document.createElement('div');
        charCount.style.textAlign = 'right';
        charCount.style.width = '100%';
        charCount.style.marginTop = '10px';
        charCount.style.fontSize = '14px';
        charCount.style.color = '#666';
        charCount.textContent = `0/90`;
    
        // Inserta el contador debajo del textarea
        textarea.insertAdjacentElement('afterend', charCount);
    
        // Actualiza el contador mientras el usuario escribe
        textarea.addEventListener('input', () => {
          const remainingChars = 90 - textarea.value.length;
          charCount.textContent = `${textarea.value.length}/90`;
          if (remainingChars < 0) {
            charCount.style.color = 'red';
          } else {
            charCount.style.color = '#666';
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivo = result.value; // Obtén el motivo introducido por el usuario
    
        // Realiza la petición al servicio con el motivo
        this.service
          .Post<any>('korima/down', { motive_down: motivo, korima })
          .subscribe({
            next: (response) => {
              Swal.fire(
                '¡Éxito!',
                'La baja ha sido registrada correctamente.',
                'success'
              );
              this.prueba();
            },
            error: (error) => {
              Swal.fire(
                'Error',
                'Ocurrió un problema al dar de baja.',
                'error'
              );
            },
          });
      }
    });
  }

  prueba() {
    this.loading = true;

    this.service
      .OtherData<any>(
        `https://predial.gomezpalacio.gob.mx:4433/api/vistakorima/${this.empleado}`
      )
      .subscribe({
        next: (n: any) => {
          this.name =
            n[0].Nombres +
            ' ' +
            n[0].ApellidoPaterno +
            ' ' +
            n[0].ApellidoMaterno;
          this.group = n[0].NombreDepartamento;
          this.payroll = `${this.empleado}`;
          this.getKorima(n);
        },
        error: (e) => {
          this.korima = [];
          this.loading = false;
          this.service.Data<any>(`user/nomina/${this.empleado}`).subscribe({
            next: (n) => {
              const item = n['data']['result'][0];
              this.name = item.name;
              this.group = item.group;
              this.payroll = item.payroll;
              this.loading = false;
            },
            error: (e) => {
              this.loading = false;
            },
          });
        },
      });
  }
  // console.log('Input value:', event.target.value);
  resetForm() {
    this.empleado = null;
  }
  getKorima(n: any) {
    let dataApiResguardos = [];
    const dataApiKorima = n;

    this.service.Data<any>('korima').subscribe({
      next: (n: any) => {
        const newData: any[] = [];
        dataApiResguardos = n['data']['result'];

        // Log para verificar el contenido de dataApiResguardos

        dataApiKorima.map((item: any) => {
          // Verifica si existe al menos un elemento en dataApiResguardos que coincida
          const exists = dataApiResguardos.some(
            (element: any) => element?.korima == item?.NumeroEconomicoKorima
          );
          if (exists) {
            const it: any = dataApiResguardos.filter(
              (element: any) => element?.korima == item?.NumeroEconomicoKorima
            );

            if (it.length > 0) {
              item.picture = it[0].picture || '';
              item.tag_picture = it[0].tag_picture || '';
              item.motive_down = it[0].motive_down || null;
              item.observation = it[0].observation || '';
              item.idResguardos = it[0].id || '';
              item.trauser_id = it[0].trauser_id || null;
              item.id = it[0].id || null;
              item.motivetransfer = it[0].motivetransfer || null;
              item.archivist = it[0].archivist;
              item.motivearchivist = it[0].motivearchivist;
            }
          } else {
            item.picture = null;
            item.tag_picture = null;

            item.observation = '';
            item.idResguardos = null;
          }

          item.existe = exists;
          newData.push(item);
        });
        this.korima = newData;
        this.loading = false;
      },
      error: (e: any) => {
        this.loading = false;
      },
    });
  }

  @ViewChild('dt') table!: Table;
  exportColumns!: ExportColumn[];
  roleTypeUser: any = localStorage.getItem('role');
  animationState!: string;
  userId: string | null;
  name!: string;
  MyForm!: FormGroup;

  group!: string;
  payroll!: string;
  visible: boolean = false;
  options: Option[] = [];
  cols!: Column[];
  data: any;
  korimaNumber: any;
  dataPrint!: Item[];
  filteredOptions: Option[] = []; // Opciones filtradas para mostrar en el dropdown
  searchText = ''; // Texto de búsqueda ingresado por el usuario
  showDropdown = false; // Variable para controlar la visibilidad del dropdow
  selected?: number | null;
  loading: boolean = false;
  buttonReport: any[] = [];
  buttonInformatica: any[] = [];
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: ServiceService<any>,
    private dialogService: DialogService,
    private param: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      if (!params['id']) {
        this.empleado =
          parseInt(localStorage.getItem('role')!) > 2
            ? localStorage.getItem('nomina')
              ? parseInt(localStorage.getItem('nomina') ?? '0')
              : null
            : null;
        if (
          this.empleado !== null &&
          !isNaN(this.empleado) &&
          this.empleado > 100
        ) {
          this.prueba();
        }
      }
    });

    this.MyForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
    });
    this.userId = this.route.snapshot.paramMap.get('id');
    this.roleTypeUser = parseInt(this.roleTypeUser);
    this.cols = [
      {
        field: 'Etiqueta',
        header: 'NUMERO DE ETIQUETA',
        customExportHeader: 'NUMERO DE INVENTARIO',
      },
      {
        field: 'Descripcion',
        header: 'NOMBRE O DESCRIPCIÓN	',
        customExportHeader: 'NOMBRE O DESCRIPCIÓN',
      },
      {
        field: 'Marca',
        header: 'MARCA Y MODELO',
        customExportHeader: 'Descripción del producto',
      },
      {
        field: 'NoSerie',
        header: 'NUMERO DE SERIE',
        customExportHeader: 'NUMERO DE SERIE',
      },

      { field: 'Estatus', header: 'Estatus', customExportHeader: 'Valor' },
      {
        field: 'NombreDepartamento',
        header: 'UBICACIÓN/DEPARTAMENTO',
        customExportHeader: 'Valor',
      },
      { field: 'FechaAlta', header: 'FechaAlta', customExportHeader: 'Valor' },

      // { field: 'airlane', header: 'ÁEREA DE ADSCRIPCION', customExportHeader: 'Departamento' },
      // { field: 'group', header: 'UBICACIÓN/DEPARTAMENTO', customExportHeader: 'Numero de etiqueta' },
      // { field: 'dateup', header: 'FECHA DE ASIGNACIÓN DEL RESGUARDO', customExportHeader: 'Numero de nomina' },
      // { field: 'datedown', header: 'FECHA DE BAJA DEL RESGUARDO	', customExportHeader: 'Numero de nomina' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }
  idResguardo: any;
  showDialog(korima: any, idResguardos) {
    this.imagen = null;
    this.tag_picture = null;

    this.idResguardo = idResguardos;
    this.korimaNumber = korima;
    this.selected = null;
    this.searchText = '';
    this.visible = true;
  }
  userprintresguardsactive() {
    this.service.setData({
      person: [
        {
          name: localStorage.getItem('name'),
          group: localStorage.getItem('group'),
        },
      ],
      data: this.korima,
    });
    const ref = this.dialogService.open(UserprintresguardsactiveComponent, {
      header: this.name,
      width: '70%',
      contentStyle: { 'max-height': '80%', overflow: 'auto' },
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      if (parseInt(params['id'], 10) > 1000) {
        this.empleado = parseInt(params['id'], 10);
        this.prueba();
      }
      this.GetUsers();
    });
    // this.route.params.subscribe(params => {
    //   this.playAnimation();

    //   this.userId = params['id'];
    //   this.GetData()
    //   this.service.Data<any>(`user/${this.userId}`).subscribe({
    //     next:(n:any)=>{
    this.name = localStorage.getItem('name') ?? '';
    this.group = localStorage.getItem('group') ?? '';
    this.payroll = localStorage.getItem('nomina') ?? '';

    //     },
    //     error:(e:any)=>{

    //     }
    //   })
    //   this.guards()
    // });
  }
  playAnimation() {
    this.animationState = this.animationState === 'start' ? 'end' : 'start';
  }

  guards() {
    this.service.Data<Option>(`guards/showOptions/${this.userId}`).subscribe({
      next: (n: any) => {
        this.options = n['data']['result'];
      },
      error: (e) => {},
    });
  }
  ngOnDestroy(): void {
    this.data = [];
  }
  onSearch(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      option.text.toLowerCase().includes(searchText)
    );
  }

  showAllOptions(): void {
    this.filteredOptions = this.options;
    this.showDropdown = true;
  }
  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  selectOption(option: Option): void {
    this.searchText = option.text;
    this.showDropdown = false;
    this.selected = option.id;
  }
  Sumbit() {
    this.loading = true;
    let json = {};
    if (this.userId !== null) {
      json = {
        guard_id: this.selected,
        user_id: parseInt(this.userId),
      };
    }
    this.service.Post<any>('usersguards/create', json).subscribe({
      next: (n: any) => {
        this.loading = false;
        this.GetData();
        this.guards();
        this.visible = false;
      },
      error: (n: any) => {
        this.loading = false;
        this.visible = false;
      },
    });
  }

  GetData() {
    this.loading = true;

    this.service.Data<any>(`usersguards/guardsUser/${this.userId}`).subscribe({
      next: (n: any) => {
        this.loading = false;
        this.data = n['data']['result'];
        this.dataPrint = this.data.filter((item: Item) => item.used == 1);
        this.buttonReport = this.data.filter(
          (item: any) => item.expecting == 1 && item.used == 1
        );
        this.buttonInformatica = this.data.filter(
          (item: any) =>
            item.expecting == 1 && item.used == 1 && item.Tipo == 'Informática'
        );
      },
      error: (n: any) => {
        this.loading = false;
      },
    });
  }
  UnsuscribeGuards() {
    this.service.setData({
      name: this.name,
      id: this.userId,
      guards: this.data.filter(
        (item: any) => item.expecting == 1 && item.used == 1
      ),
    });

    const ref = this.dialogService.open(UnsuscribeguardsComponent, {
      width: '70%',
      height: '100%',
      contentStyle: { 'max-height': '100%', overflow: 'auto' },
    });
  }
  onInputChangeReports(event: any) {
    this.dataPrint = this.data;
    if (event && event.target) {
      const inputValue: string = event.target.value;
      this.table.filterGlobal(inputValue, 'contains');
      this.dataPrint = this.searchTableDataPrint(inputValue);
      console.error(this.dataPrint);
    }
  }
  searchTableDataPrint(value: string): Item[] {
    return this.dataPrint.filter((item: any) =>
      Object.values(item).some(
        (valor) =>
          typeof valor === 'string' &&
          valor.toLowerCase().includes(value.toLowerCase())
      )
    );
  }
  deleteResguard(guard: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
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
          },
        }).then((motivoResult) => {
          if (motivoResult.isConfirmed) {
            const json = {
              observation: motivoResult.value,
            };
            this.service
              .Post(`usersguards/guardsdestroy/${guard.idguard}`, json)
              .subscribe({
                next: (n: any) => {
                  this.loading = false;
                  this.data = n['data']['result'];
                  this.GetData();
                  this.guards();
                },
                error: (n: any) => {
                  this.loading = false;
                },
              });
          }
        });
      }
    });
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const columnKeys = this.exportColumns.map((column) => column.title);

      // Crear una copia de this.guards para no modificar el original directamente
      const modifiedGuards = this.korima.map((guard: { [x: string]: any }) => {
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
      this.saveAsExcelFile(excelBuffer, 'Resguardos');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, 'Korima' + EXCEL_EXTENSION);
  }
  getWidthPercentage(): string {
    const innerWidth = window.innerWidth;
    return innerWidth < 1025 ? '100vw' : '40vw';
  }

  getHeightPercentage(): string {
    const innerWidth = window.innerWidth;
    return innerWidth < 1025 ? '100vh' : '100vh';
  }
  ReportInformatica() {
    this.service.setData({
      name: this.name,
      group: this.group,
      id: this.userId,
      data: this.korima,
    });

    const ref = this.dialogService.open(ReportceticComponent, {
      width: '70%',
      height: '100%',
      contentStyle: { 'max-height': '100%', overflow: 'auto' },
    });
  }
  expandImage = '';
  zoomIn(id: string, picture: string) {
    this.expandImage = picture;
  }
  zoomOut(id: string, picture: string) {
    this.expandImage = '';
  }
}
