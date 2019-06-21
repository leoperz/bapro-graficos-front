import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public status = false;

  constructor(private _socket : Socket) {
    this.chequearConexion();
   }

   
   
   
   chequearConexion(){
     this._socket.on('connect', ()=>{
      this.status=true;
      console.log(this.status);
     });
   }
   chequearDesconexion(){
     this._socket.on('disconnect', ()=>{
       this.status= false;
       console.log(this.status);
     })
   }


  
   //metodo generico para emitir un mensaje mediante socket

   emit(evento: string, payload?:any, callback?:Function){
      this._socket.emit(evento, payload, callback);
   }



   //metodo generico para esuchar cualquier evento en el server
   
   esucucharEvento(evento:string){
    return this._socket.fromEvent(evento);
   }

  }

