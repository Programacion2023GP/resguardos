import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-unsuscribeguards',
  templateUrl: './unsuscribeguards.component.html',
  styleUrls: ['./unsuscribeguards.component.css']
})
export class UnsuscribeguardsComponent {
  fechaActual: Date = new Date();
  formattedDate:any;
  guards: any;
  name:any;
  constructor(private service:ServiceService<any>,private route:Router,private ngxPrintService: NgxPrintService,private datePipe: DatePipe){
    
  }
  mesesEnEspanol = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  // imageURL ="http://localhost:8000/background/bg.jpg"
 imageURL ="https://api.resguardosinternos.gomezpalacio.gob.mx/public/background/bg.jpg"
 ngOnInit(): void {
    const mesActual = this.fechaActual.getMonth();

    this.formattedDate = `${this.fechaActual.getDate()} de ${this.mesesEnEspanol[mesActual]} del ${this.fechaActual.getFullYear()}`;
    this.service.data$.subscribe((data: any) => {
      this.guards = data.guards
      this.name = data.name
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
 // En tu componente
divideEnGrupos(array: any[], tamanoGrupo: number): any[][] {
  const grupos: any[][] = [];
  for (let i = 0; i < array.length; i += tamanoGrupo) {
    grupos.push(array.slice(i, i + tamanoGrupo));
  }
  return grupos;
}

  

}
