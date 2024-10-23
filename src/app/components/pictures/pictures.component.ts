import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css'],
})
export class PicturesComponent implements OnInit {
  @Input() imageUrl: string = ''; // URL de la imagen

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadImage(this.imageUrl, 200);
  }
  loadImage(url: string, size: number) {
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (blob) => {
        this.createCanvasFromBlob(blob, size);
      },
      (error) => {
        console.error('Error al cargar la imagen', error);
      }
    );
  }
  private createCanvasFromBlob(blob: Blob, size: number) {
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      const image = new Image();
      image.onload = () => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(image, 0, 0, size, size);
  
          // Exportar la imagen con calidad reducida
        
        }
      };
      image.src = imageUrl;
    };
    reader.readAsDataURL(blob);
  }
  
}
