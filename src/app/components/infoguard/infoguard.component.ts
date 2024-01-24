import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-infoguard',
  templateUrl: './infoguard.component.html',
  styleUrls: ['./infoguard.component.css']
})
export class InfoguardComponent implements OnInit {
  id!: string;
  data:any
  constructor(private service:ServiceService<any>,private route: ActivatedRoute){

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.service.Data<any>(`guards/infoguard/${this.id}`).subscribe({
        next:(n)=>{
          this.data = n['data']['result']
        }
      })
    });
  }
}
