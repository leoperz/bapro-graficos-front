import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import { ProviderService } from 'src/app/services/provider.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit, OnDestroy {
 
  mensaje:string="";
  usuariosActivos : Observable<any>;
  mensajesSubscription: Subscription;
  array:any[]=[];

  constructor(private _ws : WebsocketService, private _p : ProviderService, private _ls : LocalStorageService) { 
    
      this._p.getUsuariosActivos().subscribe();
    
    
    }

  ngOnInit() {
    
   this.usuariosActivos = this._ws.esucucharEvento('usuarios-activos');
   
   this.mensajesSubscription=this._ws.esucucharEvento('mensaje-general').subscribe((data)=>{
     this.array.push(data);
     setTimeout(() => {
      document.getElementById('chat-mensajes').scrollTop = document.getElementById('chat-mensajes').scrollHeight;
     }, 50);
   });
  }

  ngOnDestroy() {
    this.mensajesSubscription.unsubscribe();
  }





  enviar(){

    if(this.mensaje.trim().length === 0){
      return;
    }
    
    let payload = {
      de:this._ls.getIdentity().correo,
      mensaje: this.mensaje

    }
    
    this._ws.emit('mensaje', payload);
    this.mensaje="";
  }


  

  

 

}
