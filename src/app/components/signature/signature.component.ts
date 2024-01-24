import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private context:any;

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.strokeStyle = '#000000';
    this.context.lineWidth = 2;
  }

  onMouseDown(event: MouseEvent) {
    this.context.beginPath();
    this.context.moveTo(event.clientX - this.canvas.nativeElement.offsetLeft, event.clientY - this.canvas.nativeElement.offsetTop);
  }

  onMouseMove(event: MouseEvent) {
    if (event.buttons !== 1) return;

    this.context.lineTo(event.clientX - this.canvas.nativeElement.offsetLeft, event.clientY - this.canvas.nativeElement.offsetTop);
    this.context.stroke();
  }

  clearSignature() {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  saveSignature() {
    const signatureDataUrl = this.canvas.nativeElement.toDataURL();
    // Aquí puedes manejar la firma guardada, enviarla al servidor, etc.
    console.log('Firma guardada:', signatureDataUrl);
  }
}

