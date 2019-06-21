import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardGuardService implements CanActivate {
  
  
 

  constructor(private _ls : LocalStorageService, private _r : Router ) { 

  }


  canActivate(){
    console.log("entra en el canActivate");
    console.log(this._ls);
  if(this._ls.getIdentity()){
    
    
    return true;
  }else{
    console.log('entra en el else');
    this._r.navigateByUrl('/inicio');
    return false;
  }
}



}



