import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent {

  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  searchAirl!:Boolean
  groupSelected:any
  visibleGroup!: boolean;
  visibleAirlane!: boolean;
  myFormGroup!: FormGroup
  myFormAirlane!: FormGroup
  myFormAirlaneGroups!: FormGroup
  actionGroup!:Boolean
  actionAirlane!:Boolean
  dataGroup:any
  dataAirlane:any
  dataFiltersGroup:any
  dataFiltersAirlane:any
  dataNewAirlane:any = []
  dataGroupsInAirlane:any=[]
  dataGroupsFilterInAirlane:any=[]

  loading: Boolean=false;
  constructor(private service:ServiceService<any>){
    this.allGroups()
    this.allAirlane()
    this.myFormGroup = new FormGroup({
      id: new FormControl(''),
      name:new FormControl('',Validators.required),
      
    });

    this.myFormAirlane = new FormGroup({
      id: new FormControl(''),
      name:new FormControl('',Validators.required),
      
    });
    this.myFormAirlaneGroups = new FormGroup({
      id: new FormControl(''),
      airlanes_id:new FormControl('',Validators.required),
      groups_id:new FormControl('',Validators.required),
    });
  }
  addGroup() {
    this.actionGroup = true
    this.myFormGroup.reset()
    this.visibleGroup = true
  }
  addAirlane() {
    this.myFormAirlane.reset()
    this.visibleAirlane = true
    this.actionAirlane = true
  }
  onSubmitAirlane() {
    this.loading = true
    let url = 'airlanes'
    let msg = 'insertado'
    if (!this.actionAirlane) {
          url = 'airlanes/update'
          msg = 'actualizado'
    }
    this.visibleAirlane = false
    this.service.Post(url,this.myFormAirlane.value).subscribe({
      next:(n)=>{
        this.allAirlane()
        this.loading = false

        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se ha ${msg} el Aerea de adscripción`,
        });
      },
      error:(e)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `No se ha podido ${msg} el Aerea de adscripción`,
        });
        this.loading = false

      }
    }) 
   }
    onSubmitGroup() {
      this.loading = true

      let url = 'groups'
      let msg = 'insertado'

      if (!this.actionGroup) {
            url = 'groups/update'
            msg = 'actualizado'

          }
      this.visibleGroup = false

    this.service.Post(url,this.myFormGroup.value).subscribe({
      next:(n)=>{
        this.allGroups()
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se ha ${msg} el Departamento`,
        });
        this.loading = false

      },
      error:(e)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `No se ha podido ${msg} el Aerea de Departamento`,
        });
        this.loading = false

      }
    })
  }
  allGroups(){
    this.loading = true

    this.service.Data<any>('groups').subscribe({
      next:(n)=>{
        this.dataGroup = n['data']['result']
        this.dataGroup = this.dataGroup.map(obj => ({ ...obj, checked: 0 }));
        this.dataFiltersGroup = this.dataGroup

        if ( this.dataNewAirlane && this.dataNewAirlane.length > 0) {
          this.dataGroup.forEach((group, index) => {
            const found = this.dataNewAirlane.some(item => item.id === group.id);
            if (found) {
              this.dataGroup[index].checked = 1;
              this.dataFiltersGroup[index].checked = 1;
            }
          });

        }
        this.loading = false

      },
      error:(e)=>{
        this.loading = false

      }
    })
  }
  allAirlane(){
    this.loading = true

    this.service.Data<any>('airlanes').subscribe({
      next:(n)=>{
        this.loading = false

        this.dataAirlane = n['data']['result']
        this.dataFiltersAirlane = this.dataAirlane
      },
      error:(e)=>{
        this.loading = false

      }
    })
  }
  itemGroupSelected(group: any) {
    this.groupSelected = group.name
    this.searchDatainAirlane(group.id)
    this.myFormAirlaneGroups.get('airlanes_id')?.setValue(group.id)
    }
    searchDatainAirlane(id:number){
      this.loading = true

     this.service.Data<any>(`airlanesgroup/${id}`).subscribe({
      next:(n)=>{
        this.loading = false
        this.dataGroupsInAirlane =n['data']['result']
        this.dataGroupsFilterInAirlane = this.dataGroupsInAirlane
      },
      error:(e)=>{
        this.loading = false

      }
     }) 
    }
    addItemGroupInAirlane(group: any) {
      let repeatData = [];
      
      if (!this.dataNewAirlane) {
        this.dataNewAirlane = []; 
      }
    
      if (this.dataNewAirlane) {
        repeatData = this.dataNewAirlane.filter((item) => item.id === group.id);
      }
    
      if ( repeatData.length > 0) {
        this.dataNewAirlane = this.dataNewAirlane.filter((item) => item.id != group.id);
        this.dataGroup.forEach(element => {
          if (element.id ==group.id) {
              element.checked = 0
          }
      });
      }
      else{
        
        this.dataNewAirlane.push(group);
        this.dataGroup.forEach(element => {
            if (element.id ==group.id) {
                element.checked = 1
            }
        });
      }
    
    }
    searchGroup(event:any) {
        if (event.target.value.length > 1) {
          this.dataFiltersGroup = this.dataFiltersGroup.filter(u => typeof u.name === 'string' && u.name.toString().toLowerCase().includes(event.target.value.toLowerCase())
          );
        }
        else{
   
          this.dataFiltersGroup =  this.dataGroup

          
          
          
        }
    
        
    }
    searchAirlane(event:any) {
      if (event.target.value.length > 1) {
        this.dataFiltersAirlane = this.dataFiltersAirlane.filter(u => typeof u.name === 'string' && u.name.toString().toLowerCase().includes(event.target.value.toLowerCase())
        );
      }
      else{
        this.dataFiltersAirlane =  this.dataAirlane
      }
    }
    activeSearchAirlane() {
      this.searchAirl = !this.searchAirl; 
      
    }
    destroyGroup(id: number) {
      this.loading = true

      const repeatData = this.dataNewAirlane.filter((item) => item.id === id);
      if (repeatData.length>0) {
          
        return
      }
      this.service.Delete(`groups/destroy/${id}`).subscribe({
        next:(n)=>{
          
            this.allGroups()
            this.Toast.fire({
              position: 'top-end',
              icon: 'success',
              title: `Se han eliminado el Departamento`,
            });
        },
        error:(e)=>{
          this.loading = false

          this.Toast.fire({
            position: 'top-end',
            icon: 'error',
            title: `No se han podido eliminar el Departamento`,
          });
        }
      })
    }
    updateGroupSelected(group: any) {
      this.actionGroup = false
      const repeatData = this.dataNewAirlane.filter((item) => item.id === group.id);
      if (repeatData.length>0) {
          
        return
      }
      Object.keys(group).forEach((item)=>{
                this.myFormGroup.get(item)?.setValue(`${group[item]}`)
        })
        this.visibleGroup = true
    }
    clear() {
      this.dataGroupsFilterInAirlane =[]
      this.dataGroupsInAirlane =[]
      this.groupSelected = null
      this.dataNewAirlane = []
      this.dataGroup.forEach(obj => {
        obj.checked = 0;
      });
         
    }
    updateAirlaneSelected(airlane: any) {
      this.actionAirlane = false
      Object.keys(airlane).forEach((item)=>{
        this.myFormAirlane.get(item)?.setValue(`${airlane[item]}`)
      })
      this.visibleAirlane = true    
    }
    destroyAirlane(id){

      this.service.Delete(`airlanes/destroy/${id}`).subscribe({
        next:(n)=>{
            this.allAirlane()
            this.Toast.fire({
              position: 'top-end',
              icon: 'success',
              title: `Se han eliminado  el Aerea de adscripción`,
            });
        },
        error:(e)=>{
          this.Toast.fire({
            position: 'top-end',
            icon: 'error',
            title: `No ha podido eliminar   el Aerea de adscripción`,
          });
        }
      })
    }
    saveGroupsInAirlanes() {
      this.loading = true
      let idGroups: any[] = [];
      this.dataNewAirlane.forEach((element:any) => {
        idGroups.push(element.id)
      });
      this.myFormAirlaneGroups.get('groups_id')?.setValue(idGroups)
      this.service.Post('airlanesgroup',this.myFormAirlaneGroups.value).subscribe({
        next:(n)=>{
          this.searchDatainAirlane(this.myFormAirlaneGroups.value.airlanes_id)
          this.allGroups()
          this.dataNewAirlane = []
          this.Toast.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se han insertado los Departamentos en el Aerea de adscripción`,
          });
        },
        error:(e)=>{
          this.loading = false

          this.Toast.fire({
            position: 'top-end',
            icon: 'success',
            title: `NO se han podido insertar los Departamentos en el Aerea de adscripción`,
          });
        }
      })
    }
    destroyGroupOfAirlane(id: any) {
      this.loading = false
      this.service.Delete(`airlanesgroup/destroy/${id}`).subscribe({
        next:(n)=>{
          this.allGroups()
          this.searchDatainAirlane(this.myFormAirlaneGroups.value.airlanes_id)
          this.Toast.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se han eliminado el Departamento en el Aerea de adscripción`,
          });
        },
        error:(e)=>{
          this.Toast.fire({
            position: 'top-end',
            icon: 'error',
            title: ` No se han podido eliminar el Departamento en el Aerea de adscripción`,
          });
        }
      })

      
    }
    searchGroupInAirlanes(event: any) {
      if (event.target.value.length > 1) {
        this.dataGroupsFilterInAirlane = this.dataGroupsFilterInAirlane.filter(u => typeof u.name === 'string' && u.name.toString().toLowerCase().includes(event.target.value.toLowerCase())
        );
      }
      else{
 
        this.dataGroupsFilterInAirlane =  this.dataGroupsInAirlane

        
        
        
      }
    }
  }
