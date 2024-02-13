import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService<T> {
 
  // route: string =' http://127.0.0.1:8000/api'
    route: string =  "https://api.resguardosinternos.gomezpalacio.gob.mx/api";
  constructor(private http: HttpClient) { 
  }
  
  Data<T>(url: string) {
    return this.http.get<T>(`${this.route}/${url}`);
  }
  OtherData<T>(url: string) {
    return this.http.get<T>(`${url}`);
  }
  Post<T>(url: string, params: any) {
    return this.http.post<T>(`${this.route}/${url}`, params);
  }
  
  Logout(url: string) {
    
    return this.http.post(`${this.route}/${url}`,"");
  }

  Put(url: string, params: any) {
    return this.http.put(`${this.route}/${url}`, params);
  }
  Delete(url:string) {
    return this.http.post(`${this.route}/${url}`,'');
  }

  
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  setData(data: any) {
    this.dataSubject.next(data);
  }
  downloadImage(url: string) {
    return this.http.get(`${this.route}/${url}`, { responseType: 'blob' });
  }
}