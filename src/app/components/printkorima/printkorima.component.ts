import { Component, OnInit } from '@angular/core';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import html2pdf from 'html2pdf.js';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-printkorima',
  templateUrl: './printkorima.component.html',
  styleUrls: ['./printkorima.component.css']
})
export class PrintkorimaComponent implements OnInit {
  imageURL ="https://api.resguardosinternos.gomezpalacio.gob.mx/public/background/bg.jpg"
  options = {
    margin: 0.5, // Margen del PDF
    filename: 'baja_activos.pdf', // Nombre del archivo PDF
    image: {
      type: 'jpeg', // Cambia a 'jpeg' para mayor compatibilidad
      quality: 1 // Calidad máxima
    },
    html2canvas: {
      scale: 2, // Aumentar el valor de escala para una mejor resolución
      useCORS: true,
      logging: true // Habilitar registros para depuración (opcional)
    },
    jsPDF: {
      unit: 'cm',
      format: 'a4', // Formato A4 más común
      orientation: 'portrait', // Orientación vertical
      pageSize: 'A4' // Asegurarte de que sea el tamaño adecuado
    }
  };

  constructor(private service:ServiceService<any>,private ngxPrintService: NgxPrintService) { 
 
  }
item:any
  ngOnInit() { 
    this.service.data$.subscribe((data: any) => {
         this.item = data.item
         console.log(this.item)
    });
  }

  imprimir(): void {
    const element = document.getElementById('pEl'); // Asegúrate de que este sea el ID correcto
    if (element) {
      html2pdf()
        .from(element)
        .set(this.options)
        .save()
        .catch(err => console.error('Error al generar PDF:', err)); // Manejar errores
    } else {
      console.error('Elemento no encontrado para imprimir.');
    }
  }
}
