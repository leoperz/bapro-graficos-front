import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardGuardService } from './guards/dashboard-guard.service';
import { PerfilComponent } from './components/perfil/perfil.component';
import { IncidenteComponent } from './components/incidente/incidente.component';

const appRoutes: Routes = [
  {path: 'inicio', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuardService]},
  {path: 'perfil', component: PerfilComponent},
  {path:'incidente', component: IncidenteComponent},
  {path:'**', component:LoginComponent}
];

@NgModule({
  
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
