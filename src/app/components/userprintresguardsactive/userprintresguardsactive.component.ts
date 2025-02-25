import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import html2pdf from 'html2pdf.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-userprintresguardsactive',
  templateUrl: './userprintresguardsactive.component.html',
  styleUrls: ['./userprintresguardsactive.component.css'],
})
export class UserprintresguardsactiveComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('pdfIframe') pdfIframe: any;

  ngAfterViewInit(): void {
    // Ahora puedes acceder a pdfIframe.nativeElement
    if (this.pdfIframe) {
      console.log('pdfIframe está listo:', this.pdfIframe.nativeElement);
      this.generatePDF(
        this.person,
        this.data,
        this.fechaActual,
        this.horaActual
      );
      console.log('generado el pdf');
    }
  }
  // imagePath: string = 'assets/gomez.png'; // Reemplaza con tu URL
  data: any;
  person: any;
  fechaActual: string;
  horaActual: string;
  imageUrl =
    'https://api.resguardosinternos.gomezpalacio.gob.mx/public/Resguardos/2024-01-31_18-32-19_IMG-20240126-WA0033.jpg';

  loading = false;
  options = {
    margin: 1,
    filename: 'newfile.pdf',
    image: {
      type: 'png',
      quality: 1,
      width: 1000, // Ancho máximo de la imagen en el PDF
    },
    html2canvas: { scale: 1.5, useCORS: true },

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
  generatePDF(
    person: any,
    data: any,
    fechaActual: string,
    horaActual: string
  ): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 30;

    const addHeader = () => {
      const imgWidth = 30;
      const imgHeight = 30;
      const imgX = margin;
      const imgY = 10;

      // Add image
      doc.addImage(
        '../../../assets/icon.png',
        'PNG',
        imgX,
        imgY,
        imgWidth,
        imgHeight
      );

      // Add title and subtitle
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RESGUARDO DE ACTIVOS', pageWidth / 2, 25, { align: 'center' });
      doc.setFontSize(12);
      doc.text('MUNICIPIO GOMEZ PALACIO', pageWidth / 2, 45, {
        align: 'center',
      });

      // Add line below title and subtitle
      doc.setLineWidth(0.5);
      doc.line(margin, 55, pageWidth - margin, 55);
    };

    addHeader();

    // Tabla de información del empleado
    const tableTop = 70;

    // Dibujamos los bordes de la tabla con línea más fina
    doc.setLineWidth(0.5);

    // Primera fila
    const infoRowHeight = 25;
    doc.rect(margin, tableTop, 150, infoRowHeight);
    doc.rect(margin + 150, tableTop, 220, infoRowHeight);
    doc.rect(margin + 370, tableTop, 90, infoRowHeight);
    doc.rect(margin + 460, tableTop, 90, infoRowHeight);

    // Segunda fila
    doc.rect(margin, tableTop + infoRowHeight, 150, infoRowHeight);
    doc.rect(margin + 150, tableTop + infoRowHeight, 220, infoRowHeight);
    doc.rect(margin + 370, tableTop + infoRowHeight, 90, infoRowHeight);
    doc.rect(margin + 460, tableTop + infoRowHeight, 90, infoRowHeight);

    // Tercera fila
    doc.rect(margin, tableTop + infoRowHeight * 2, 150, infoRowHeight);
    doc.rect(margin + 150, tableTop + infoRowHeight * 2, 400, infoRowHeight);

    // Cuarta fila
    doc.rect(margin, tableTop + infoRowHeight * 3, 150, infoRowHeight);
    doc.rect(margin + 150, tableTop + infoRowHeight * 3, 400, infoRowHeight);

    // Texto de la tabla
    doc.setFontSize(10);
    doc.text('Empleado Responsable :', margin + 10, tableTop + 17);
    doc.setFont('helvetica', 'normal');
    doc.text(person[0].name || '', margin + 160, tableTop + 17);
    doc.setFont('helvetica', 'bold');
    doc.text('No.Resguardo:', margin + 380, tableTop + 17);

    doc.text('Puesto :', margin + 10, tableTop + infoRowHeight + 17);
    doc.text('Fecha:', margin + 380, tableTop + infoRowHeight + 17);
    doc.setFont('helvetica', 'normal');
    doc.text(
      fechaActual || '18/02/2025',
      margin + 470,
      tableTop + infoRowHeight + 17
    );

    doc.setFont('helvetica', 'bold');
    doc.text('Departamento :', margin + 10, tableTop + infoRowHeight * 2 + 17);
    doc.setFont('helvetica', 'normal');
    doc.text(
      person[0].group || '',
      margin + 160,
      tableTop + infoRowHeight * 2 + 17
    );

    doc.setFont('helvetica', 'bold');
    doc.text('Localidad :', margin + 10, tableTop + infoRowHeight * 3 + 17);
    doc.setFont('helvetica', 'normal');
    doc.text(
      person.location || 'GOMEZ PALACIO',
      margin + 160,
      tableTop + infoRowHeight * 3 + 17
    );

    // Observaciones
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones :', margin, tableTop + infoRowHeight * 4 + 15);

    // Encabezado de tabla de inventario
    const inventoryTop = tableTop + infoRowHeight * 4 + 30;
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, inventoryTop, 170, 25, 'F');
    doc.rect(margin + 170, inventoryTop, 370, 25, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, inventoryTop, 170, 25);
    doc.rect(margin + 170, inventoryTop, 370, 25);
    doc.setFont('helvetica', 'bold');
    doc.text('No. INVENTARIO', margin + 30, inventoryTop + 17);
    doc.text('Descripción DEL BIEN', margin + 270, inventoryTop + 17);

    // Subencabezado Muebles
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Muebles', margin, inventoryTop + 40);

    let y = inventoryTop + 60;
    let itemsOnPage = 0;
    const maxItemsFirstPage = 3;
    const maxItemsOtherPages = 5;

    // Función para cargar imágenes (implementación real con addImage cuando se tenga la URL)
    const loadImage = (
      url: string,
      xPos: number,
      yPos: number,
      width: number,
      height: number
    ) => {
      const drawPlaceholder = () => {
        doc.setDrawColor(150, 150, 150);
        doc.setFillColor(235, 235, 235);
        doc.roundedRect(xPos, yPos, width, height, 3, 3, 'FD');

        // Texto dentro del placeholder
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('IMAGEN', xPos + width / 2, yPos + height / 2, {
          align: 'center',
        });
        doc.setTextColor(0, 0, 0);
      };
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
          doc.addImage(img, 'JPEG', xPos, yPos, width, height);
          resolve();
        };
        img.onerror = () => {
          drawPlaceholder();
          resolve();
        };
      });
    };

    // Lista de datos simulados si data está vacío
    if (!data || data.length === 0) {
      data = [];
    }

    const addItemToPDF = async (item: any, limit, size) => {
      // Contenedor para cada artículo
      const itemHeight = 100;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, 540, itemHeight);

      // Imagen del artículo
      await loadImage(item.picture || '', margin + 10, y + 10, 70, 80);

      // Detalles del artículo - mejor alineados y formateados
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.stock_number || ''}`, margin + 90, y + 20);
      doc.text('FECHA DE RECEPCION DE BIENES :', margin + 150, y + 20);
      doc.setFont('helvetica', 'normal');
      doc.text(
        item.dateup || item.FechaAlta || '27/01/2025',
        margin + 320,
        y + 20
      );
      doc.setFont('helvetica', 'bold');
      doc.text('No. Economico :', margin + 380, y + 20);
      doc.setFont('helvetica', 'normal');
      doc.text(item.stock_number || '', margin + 470, y + 20);

      // Segunda línea
      doc.setFont('helvetica', 'bold');
      doc.text('DESCRIPCION :', margin + 90, y + 40);
      doc.setFont('helvetica', 'normal');
      doc.text(item.description || '', margin + 170, y + 40);
      doc.setFont('helvetica', 'bold');
      doc.text('MODELO :', margin + 380, y + 40);
      doc.setFont('helvetica', 'normal');
      doc.text(
        item.brand || item.Modelo || 'sin marca color negro',
        margin + 435,
        y + 40
      );

      // Tercera línea
      doc.setFont('helvetica', 'bold');
      doc.text('UBICACION :', margin + 90, y + 60);
      doc.setFont('helvetica', 'normal');
      const location = item.group || item.NombreDepartamento || '';
      doc.text(location, margin + 160, y + 60);
      doc.setFont('helvetica', 'bold');
      doc.text('No. SERIE :', margin + 380, y + 60);
      doc.setFont('helvetica', 'normal');
      doc.text(
        item.serial || item.NoSerie || 'BD71540437',
        margin + 440,
        y + 60
      );

      // Cuarta línea - observaciones con manejo de texto largo
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVACIONES :', margin + 90, y + 80);
      doc.setFont('helvetica', 'normal');

      // Manejar observaciones largas
      const observations = item.observations ?? item.observation ?? '';
      if (observations.length > 55) {
        const words = observations.split(' ');
        let line = '';
        let yOffset = 0;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          if (testLine.length > 55) {
            doc.text(line, margin + 190, y + 80 + yOffset);
            line = words[i] + ' ';
            yOffset += 15;
          } else {
            line = testLine;
          }
        }
        if (line.trim() !== '') {
          doc.text(line, margin + 190, y + 80 + yOffset);
        }
      } else {
        doc.text(observations, margin + 190, y + 80);
      }

      // Incrementar posición vertical para el siguiente artículo
      y += itemHeight;
      itemsOnPage++;

      // Agregar nueva página si es necesario
      if (
        (itemsOnPage === maxItemsFirstPage && doc.getNumberOfPages() === 1) ||
        (itemsOnPage === maxItemsOtherPages && doc.getNumberOfPages() > 1)
      ) {
      await  this.addSignatures(doc, margin, y, person);
        if (limit < size) {
          doc.addPage();
          addHeader();
        }
        y = 70;
        itemsOnPage = 0;
        
      } else if (
        (size < maxItemsFirstPage && size == itemsOnPage) ||
        (size == limit && size % maxItemsOtherPages !== 0)
      ) {
        console.log('FINAL')
        await    this.addSignatures(doc, margin, y, person);
      }
    };

    const processItems = async () => {
      let limit = 0;
      let size = data.length; // Corrige 'lenght' a 'length'
      for (const item of data) {
        limit++;
        await addItemToPDF(item, limit, size);
      }
      // console.log('Total',size % maxItemsOtherPages != 0)
      // if( size % maxItemsOtherPages != 0){
      //   await  this.addSignatures(doc, margin, y, person);

      // }

      // Asegurarnos de que hay espacio suficiente para la sección de firmas
      // if (y > pageHeight - 200) {
      //   // Adjusted to ensure space for signatures
      //   this.addSignatures(doc, margin, y, person);
      //   doc.addPage();
      //   addHeader();
      //   y = 70;
      // }

      // // Sección de firmas en la parte inferior
      // this.addSignatures(doc, margin, y + 40, person);

      // Generar el PDF
      const pdfOutput = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfOutput);
      // window.open(pdfUrl, '_blank');

      // Si tienes un elemento iframe
      if (this.pdfIframe && this.pdfIframe.nativeElement) {
        this.pdfIframe.nativeElement.src = pdfUrl;
      }
    };

    processItems();
  }

  async addSignatures(doc: any, margin: number, y: number, person: any) {
    // Crear recuadros para firmas con mejor diseño
    const signWidth = 160;
    const signHeight = 160; // Aumentar la altura para dar más espacio para la firma
    const signGap = 20;
    const marginTop = 30; // Espacio adicional antes de las firmas

    doc.setLineWidth(0.7);
    doc.setDrawColor(0, 0, 0);

    // Sumar el margen superior a 'y' para crear el espacio antes de las rectas
    const yPosition = y + marginTop;

    // Crear los rectángulos para cada firma (con mayor altura)
    doc.rect(margin, yPosition, signWidth, signHeight); // Entrega
    doc.rect(margin + signWidth + signGap, yPosition, signWidth, signHeight); // Vo Bo
    doc.rect(
      margin + 2 * (signWidth + signGap),
      yPosition,
      signWidth,
      signHeight
    ); // Firma de recibido

    // Encabezados de las firmas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ENTREGA', margin + signWidth / 2, yPosition + 15, {
      align: 'center',
    });
    doc.text(
      'Vo Bo',
      margin + signWidth + signGap + signWidth / 2,
      yPosition + 15,
      { align: 'center' }
    );
    doc.text(
      'Firma de recibido',
      margin + 2 * (signWidth + signGap) + signWidth / 2,
      yPosition + 15,
      { align: 'center' }
    );

    // Espaciado dentro de cada firma (espacio mayor para la firma)
    const textYPosition = yPosition + 30;

    // Espacio para la firma (ahora sin la línea)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Coloca un mayor espacio para la firma
    doc.text('', margin + signWidth / 2, textYPosition + 30, {
      align: 'center',
    }); // Solo espacio vacío para firma

    // Nombre debajo de la firma
    doc.text(
      'LIC. GERARDO ALFREDO',
      margin + signWidth / 2,
      textYPosition + 50,
      { align: 'center' }
    );
    doc.text('BURCIAGA AVEDAÑO', margin + signWidth / 2, textYPosition + 60, {
      align: 'center',
    });
    doc.text(
      'DIRRECCIÓN DE RECURSOS',
      margin + signWidth / 2,
      textYPosition + 70,
      { align: 'center' }
    );
    doc.text(
      'MATERIALES Y PATRIMONIAL',
      margin + signWidth / 2,
      textYPosition + 80,
      { align: 'center' }
    );

    // Espacio para la firma "Vo Bo"
    doc.text(
      '',
      margin + signWidth + signGap + signWidth / 2,
      textYPosition + 30,
      { align: 'center' }
    ); // Espacio para firma

    // Nombre para "Vo Bo"
    doc.text(
      'JEFE INMEDIATO',
      margin + signWidth + signGap + signWidth / 2,
      textYPosition + 50,
      { align: 'center' }
    );

    // Espacio para la firma "Firma de recibido"
    const recipientName = person[0].name;
    const splitRecipientName = doc.splitTextToSize(
      recipientName,
      signWidth - 10
    );
    doc.text(
      '',
      margin + 2 * (signWidth + signGap) + signWidth / 2,
      textYPosition + 30,
      { align: 'center' }
    ); // Espacio para firma

    // Nombre para "Firma de recibido"
    doc.text(
      splitRecipientName,
      margin + 2 * (signWidth + signGap) + signWidth / 2,
      textYPosition + 50,
      { align: 'center' }
    );
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
    const element = document.getElementById('pEl');
    console.log(element);
    html2pdf().from(element).set(this.options).save();
  }
}
