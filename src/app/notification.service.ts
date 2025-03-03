import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private zone: NgZone) {}

  getServerSentEvent(url: string): Observable<MessageEvent> {
    return new Observable(observer => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = (error) => {
        console.error('Error en la conexión SSE');

      };

      return () => {
        eventSource.close();
      };
    });
  }
}