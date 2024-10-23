import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import html2pdf from 'html2pdf.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-userprintresguardsactive',
  templateUrl: './userprintresguardsactive.component.html',
  styleUrls: ['./userprintresguardsactive.component.css'],
})
export class UserprintresguardsactiveComponent implements OnInit {
  @ViewChild('pdfElement') pdfEl!: ElementRef;
  @ViewChild('pdfirmas', { static: true }) firmas!: ElementRef;
  // imagePath: string = 'assets/gomez.png'; // Reemplaza con tu URL
  data: any;
  person: any;
  fechaActual: string;
  horaActual: string;
  imageUrl = 'https://api.resguardosinternos.gomezpalacio.gob.mx/public/Resguardos/2024-01-31_18-32-19_IMG-20240126-WA0033.jpg';

  loading =false
  options = {
    margin: 1,
    filename: 'newfile.pdf',
    image: {
      type: 'png',
      quality: 1,
      width: 1000, // Ancho máximo de la imagen en el PDF
    },
    html2canvas: 
    { scale: 1.5,
      useCORS: true,

    },

    jsPDF: {
      unit: 'cm',
      format: 'letter',
      orientation: 'portrait',
      // Ajusta scrollY para que incluya contenido no visible
      scrollY: 0, // Puedes ajustar esto según tus necesidades
    },

  };
  constructor(
    private service: ServiceService<any>,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {
    const today = new Date();
    this.fechaActual = this.datePipe.transform(today, 'dd/MM/yyyy')!;
    this.horaActual = this.datePipe.transform(today, 'hh:mm a')!;
  }
  ngOnInit(): void {

    this.service.data$.subscribe({
      next: (n: any) => {
        this.person = n.person;
        this.data = n.data;
      },
    });

   
    
    // Obtener datos con el método OtherData
 
    
  
    
  
    // const img = new Image();
    // img.src = this.imageUrl;
  }
 
//   downloadPDF() {
//     // Crea el documento PDF
//     const documentDefinition = {
//       content: [
//         {
//           snow: this.imageUrl,
//           width: 500, // Ajusta el tamaño según sea necesario
//         },
//         {
//           text: 'Imagen de Resguardo',
//           style: 'header',
//           margin: [0, 20, 0, 0],
//         },
//       ],
//       styles: {
//         header: {
//           fontSize: 20,
//           bold: true,
//           margin: [0, 20, 0, 10],
//         },
//       },
//     };

//     // Descarga el PDF
//     pdfMake.createPdf(documentDefinition).download('document.pdf');
//   }
// }
  downloadPDF() {
    // let imageUrl ='https://api.resguardosinternos.gomezpalacio.gob.mx/public/Resguardos/2024-01-31_18-32-19_IMG-20240126-WA0033.jpg';
    // fetch(imageUrl)
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       imageUrl = reader.result as string; // Esto es la cadena base64
    //     };
    //     reader.readAsDataURL(blob);
    //   });
    const element = document.getElementById('pEl');
    console.log(element);
    html2pdf().from(element).set(this.options).save();
    //   const pEl = this.pdfEl.nativeElement;
    //   // Clonar el elemento para evitar que se modifique el original
    //   const clone = pEl.cloneNode(true);
    //   // Esperar a que todas las imágenes se carguen antes de crear el PDF
    //   const images = clone.getElementsByTagName('img');
    //   const imagePromises: Promise<void>[] = [];
    //   for (const img of images) {
    //     imagePromises.push(
    //       new Promise((resolve) => {
    //         img.onload = () => resolve();
    //         img.onerror = () => resolve(); // Resuelve aunque falle para evitar bloqueos
    //       })
    //     );
    //   }
    //   console.log('REVISAR LAS IMAGENES PROMISE', imagePromises);
    //   // Esperar a que todas las imágenes se hayan cargado
    //   Promise.all(imagePromises).then(() => {
    //     this.options.filename = this.person[0].picture;
    //     html2pdf().from(clone).set(this.options).save();
    //   });
    // }
  }
}
