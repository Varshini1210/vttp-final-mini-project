import { Injectable } from "@angular/core";
import { Client, Message, Stomp } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class WebSocketService {

    private stompClient!: Client | null;
    private adminNotifications = new BehaviorSubject<string | null>(null);



    constructor() {
      this.connect();
    }

    private connect(): void {
      const socket = new SockJS('/ws'); // Use relative path for proxy support
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (msg: string) => console.log(msg),
        onConnect: () => {
          console.log('Connected to WebSocket');
          this.stompClient?.subscribe('/topic/admin/queue-updates', (message) => {
            this.adminNotifications.next(message.body);
          });
        }
      });
      this.stompClient.activate();
    }

    getAdminNotifications() {
      return this.adminNotifications.asObservable();
    }
      

}