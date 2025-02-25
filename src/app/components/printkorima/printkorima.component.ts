import { Component, OnInit } from '@angular/core';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import html2pdf from 'html2pdf.js';
import { ServiceService } from 'src/app/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-printkorima',
  templateUrl: './printkorima.component.html',
  styleUrls: ['./printkorima.component.css'],
  standalone: true,
  imports: [CommonModule], // Asegúrate de incluir CommonModule aquí
})
export class PrintkorimaComponent implements OnInit {
  imageURL =
    'https://api.resguardosinternos.gomezpalacio.gob.mx/public/background/bg.jpg';
  options = {
    margin: 0.5, // Margen del PDF
    filename: 'baja_activos.pdf', // Nombre del archivo PDF
    image: {
      type: 'jpeg', // Cambia a 'jpeg' para mayor compatibilidad
      quality: 1, // Calidad máxima
    },
    html2canvas: {
      scale: 2, // Aumentar el valor de escala para una mejor resolución
      useCORS: true,
      logging: true, // Habilitar registros para depuración (opcional)
    },
    jsPDF: {
      unit: 'cm',
      format: 'a4', // Formato A4 más común
      orientation: 'portrait', // Orientación vertical
      pageSize: 'A4', // Asegurarte de que sea el tamaño adecuado
    },
  };
  loading: boolean = true;
  constructor(
    private service: ServiceService<any>,
    private ngxPrintService: NgxPrintService
  ) {}
  item: any;
  currentDate: Date = new Date();

  // Método para formatear la fecha en el formato requerido
  getFormattedDate(): string {
    const day = this.currentDate.getDate();
    const month = this.currentDate.toLocaleString('default', { month: 'long' });
    const year = this.currentDate.getFullYear();

    return `Gómez Palacio, Dgo; a ${day} de ${month} de ${year}`;
  }
  ngOnInit() {
    // Bienestar Social
    this.loading = true;
    this.service.data$.subscribe({
      next: (data: any) => {
        const replace =
          data.item['NombreDepartamento'] == 'DESARROLLO SOCIAL'
            ? 'Bienestar Social'
            : data.item['NombreDepartamento'];
        this.service.Post('users/firmas', { group: replace }).subscribe({
          next: (res: any) => {
            this.item = data.item;
            this.item['img_stamp'] = res['data']['result']['img_stamp'];
            this.item['img_firm'] = res['data']['result']['img_firm'];
            this.item['department'] = res['data']['result']['department'];

            this.item['name'] =
              res['data']['result']['name'] +
              ' ' +
              res['data']['result']['paternal_last_name'] +
              ' ' +
              res['data']['result']['maternal_last_name'];
            this.loading = false; // Esto se mueve aquí para asegurarse de que se complete después de que todo esté cargado
          },
          error: (err) => {
            console.error('Error al obtener firma:', err);
            this.loading = false; // Asegúrate de poner loading en false también en caso de error
          },
        });
      },
      error: (e) => {
        this.loading = false; // Asegúrate de poner loading en false si hay un error en el observable
        console.error('Error en la suscripción:', e);
      },
    });
  }

  imprimir(): void {
    const element = document.getElementById('pEl'); // Asegúrate de que este sea el ID correcto
    if (element) {
      html2pdf()
        .from(element)
        .set(this.options)
        .save()
        .catch((err) => console.error('Error al generar PDF:', err)); // Manejar errores
    } else {
      console.error('Elemento no encontrado para imprimir.');
    }
  }
}
