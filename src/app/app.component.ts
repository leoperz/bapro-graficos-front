import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private _r : Router){
    
  }

  ngOnInit(): void {
    console.log('ingresa en el app.components.ts');
    if(localStorage.getItem('identity')){
      let identity = JSON.parse(localStorage.getItem('identity'));
      if(identity.recordame == false){
        localStorage.removeItem('identity');
        if(localStorage.getItem('token')){
          localStorage.removeItem('token');
        }
        this._r.navigateByUrl('/');


      }else{
        this._r.navigateByUrl('/dashboard');
      }
    }


  }
  title = 'Dashboard';
}
