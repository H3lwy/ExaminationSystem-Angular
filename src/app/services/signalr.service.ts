import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private notificationSubject = new Subject<string>();
  notification$ = this.notificationSubject.asObservable();

  constructor() {}

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7113/adminhub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log(
          'SignalR Connection Started, Connection ID:',
          this.hubConnection.connectionId
        );
      })
      .catch((err) => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log('Notification received:', message);
      this.notificationSubject.next(message);
    });


  }

  
}
