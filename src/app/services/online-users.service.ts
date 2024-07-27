import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineUsersService {
  onlineUsers$ = this.socket.fromEvent<number>('onlineUsers');
  connections$ = this.socket.fromEvent<number>('connections');

  constructor(
    private socket: Socket
  ) {}

  // getOnlineUsersCount() {
  //   return this.socket.fromEvent<number>('updateOnlineUsers').pipe(map(data => data));
  // }
}
