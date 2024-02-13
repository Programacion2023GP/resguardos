import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { NgxPrintService, PrintOptions } from 'ngx-print';

@Component({
  selector: 'app-reportresguards',
  templateUrl: './reportresguards.component.html',
  styleUrls: ['./reportresguards.component.css']
})
export class ReportresguardsComponent implements OnInit {

  guards:any
  constructor(private service:ServiceService<any>,private ngxPrintService: NgxPrintService) {


  }
  ngOnInit(): void {
    this.service.data$.subscribe((data: any) => {
      this.guards = data.guards
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
  deleteResguard(guard: any) {
    this.guards = this.guards.filter((item:any)=>item.id !=guard.id)
    }
}
