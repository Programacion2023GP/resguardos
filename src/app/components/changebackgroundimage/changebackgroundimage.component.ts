import { Component, ElementRef, ViewChild } from '@angular/core';
import { ServiceService } from '../../service.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-changebackgroundimage',
  templateUrl: './changebackgroundimage.component.html',
  styleUrls: ['./changebackgroundimage.component.css']
})
export class ChangebackgroundimageComponent {
  // imageURL ="http://localhost:8000/background/bg.jpg"
 imageURL ="https://api.resguardosinternos.gomezpalacio.gob.mx/public/background/bg.jpg"
 isImageLoaded: boolean = false;
 Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
 @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private service:ServiceService<any>){}
  handleImageLoad(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageURL = e.target.result;
        this.isImageLoaded = true;
      };

      if (file) {
        const imageSizeInBytes = file.size;
    
        const imageSizeInKB = imageSizeInBytes / 1024;
      
        const imageSizeInMB = imageSizeInKB / 1024;  
        console.warn(imageSizeInMB)
        if (imageSizeInMB >= 2) {
          this.Toast.fire({
            position: 'top-end',
            icon: 'error',
            title: `la imagen supera el tamaño permitido`,
          });
          return
        }
      }

      this.uploadImage(fileInput.files[0]);

      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  openFileInput() {
    // this.fileInput.nativeElement.click();
  }
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file, file.name);

    this.service.Post('background', formData).subscribe({
      next:(n)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `la plantilla se a cambiado`,
        });
      },
      error:()=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `la plantilla no se pudo cambiar`,
        });
      }
    })
     
  }
}
