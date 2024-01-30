import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPrintService } from 'ngx-print';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-unsuscribeguards',
  templateUrl: './unsuscribeguards.component.html',
  styleUrls: ['./unsuscribeguards.component.css']
})
export class UnsuscribeguardsComponent {
  constructor(private service:ServiceService<any>,private route:Router,private ngxPrintService: NgxPrintService){

  }
  ngOnInit(): void {
    this.service.data$.subscribe((data: any) => {
    
    console.warn(data)
    });
    
  }
}
