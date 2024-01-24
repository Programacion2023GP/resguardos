import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';
import { NgxPrintService, PrintOptions } from 'ngx-print';
  
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  guard:any
  @ViewChild('contentToPrint', { static: false }) contentToPrint!: ElementRef;
  myAngularxQrCode!: string; // Datos que se codificarán en el código QR
  constructor(private service:ServiceService<any>,private route:Router,private ngxPrintService: NgxPrintService){

  }
  ngOnInit(): void {
    this.service.data$.subscribe((data: any) => {
    
      if (!data) {
        // this.route.navigate(['Resguardos']);
      } else {
        this.guard = data;
        if (this.guard && this.guard.guard && this.guard.guard.id) {
          this.myAngularxQrCode = `https://resguardosinternos.gomezpalacio.gob.mx/#/Informacion/${this.guard.guard.id}`;
        } 
      }
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
  
  
   

onChangeURL(event: any) {
}

}
