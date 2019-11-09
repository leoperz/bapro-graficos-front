import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import * as AOS from 'aos';
import { WebsocketService } from './services/websocket.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private _r : Router, private _ws: WebsocketService){
    
  }

  ngOnInit(): void {
  this._ws.esucucharEvento('mensaje-privado').subscribe(data=>console.log('mensaje:',data));
   AOS.init();
    if(localStorage.getItem('identity')){
      let identity = JSON.parse(localStorage.getItem('identity'));
      this._ws.emit('configurar-usuario', identity);
      if(identity.recordame == false){
        localStorage.removeItem('identity');
        if(localStorage.getItem('token')){
          localStorage.removeItem('token');
        }
        this._r.navigateByUrl('/');


      }else{
        this._r.navigateByUrl('/dashboard');
        this._ws.emit('configurar-usuario', identity);
      }
    }


  }
  title = 'Dashboard';
}
