import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  array:[]=[];
  public status = false;
  

  constructor(private _socket : Socket) {
    this.chequearConexion();
    this.chequearDesconexion();
   }

   
   
   
   chequearConexion(){
     this._socket.on('connect', ()=>{
      this.status=true;
      
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
   
   esucucharEvento(evento:string, email?:string){
    return this._socket.fromEvent(evento);
   }

   
    
   }


  

  

