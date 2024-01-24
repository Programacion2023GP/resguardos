import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-userprintresguardsactive',
  templateUrl: './userprintresguardsactive.component.html',
  styleUrls: ['./userprintresguardsactive.component.css']
})
export class UserprintresguardsactiveComponent implements OnInit {
  @ViewChild('pdfElement') pdfEl!: ElementRef;
  @ViewChild('pdfirmas', { static: true }) firmas!: ElementRef;

  data:any
  person:any
  fechaActual: string;
  horaActual: string;
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
  constructor(private service:ServiceService<any>,private datePipe: DatePipe){
    const today = new Date();
    this.fechaActual = this.datePipe.transform(today, 'dd/MM/yyyy')!;
    this.horaActual = this.datePipe.transform(today, 'hh:mm a')!;
  }
  ngOnInit(): void {
    this.service.data$.subscribe({
      next:(n:any)=>{
        console.warn(n)
        this.person=n.person
        this.data = n.data
      }
    })
  }
  downloadPDF() {
    const pEl = this.pdfEl.nativeElement;
    const clone = pEl.innerHTML;
    
    this.options.filename = this.person[0].name
    html2pdf().from(clone).set(this.options).save();
  }
}
