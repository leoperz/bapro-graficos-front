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
    
  if(this._ls.getIdentity()){
    
    return true;
  }else{
    this._r.navigateByUrl('/inicio');
    return false;
  }
}



}



