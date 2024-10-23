import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';
import { NgxPrintService, PrintOptions } from 'ngx-print';
@Component({
  selector: 'app-reportcetic',
  templateUrl: './reportcetic.component.html',
  styleUrls: ['./reportcetic.component.css']
})
export class ReportceticComponent {
  fechaActual: Date = new Date();
  formattedDate:any;
  fecha:any;
  guards: any;
  name:any;
  group:any;

  constructor(private service:ServiceService<any>,private route:Router,private ngxPrintService: NgxPrintService){
    
  }
  mesesEnEspanol = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  // imageURL ="http://localhost:8000/background/bg.jpg"
 imageURL ="https://api.resguardosinternos.gomezpalacio.gob.mx/public/background/bg.jpg"
 ngOnInit(): void {
    const mesActual = this.fechaActual.getMonth();
    this.fecha = `${this.fechaActual.getDate()} de ${this.mesesEnEspanol[mesActual]} del ${this.fechaActual.getFullYear()}`;

    this.formattedDate = ` ${this.fechaActual.getFullYear()}`;
    this.service.data$.subscribe((data: any) => {
      this.guards = data.guards 
      this.name = data.name
      this.group = data.group

    });
  
    
  }
  imprimir(): void {
    const printOptions: PrintOptions = {
      printSectionId: 'contenidoParaImprimir', // Asegúrate de que coincida con el ID en tu HTML
      printTitle: '',
      useExistingCss: true, // Utilizar estilos existentes
      bodyClass: '',
      openNewTab: true,
      previewOnly: false,
      closeWindow: false,
      printDelay: 0
      
    };

    this.ngxPrintService.print(printOptions);
  }
  divideEnGrupos(array: any[], tamanoGrupo: number): any[][] {
    const grupos: any[][] = [];
    for (let i = 0; i < array.length; i += tamanoGrupo) {
      grupos.push(array.slice(i, i + tamanoGrupo));
    }
    return grupos;
  }
  
}
