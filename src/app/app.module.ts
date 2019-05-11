import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { AppComponent } from './app.component';
import {ChartsModule} from 'ng2-charts';
import { GraficaComponent } from './components/grafica/grafica.component';
import {HttpClientModule} from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent} from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { PerfilComponent } from './components/perfil/perfil.component';
import {MatInputModule, MatButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IncidenteComponent } from './components/incidente/incidente.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const config: SocketIoConfig = {url:'http://localhost:5500', options:{}};

@NgModule({
  declarations: [
    AppComponent,
    GraficaComponent,
    DashboardComponent,
    LoginComponent,
    PerfilComponent,
    IncidenteComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NgbModule
   
  ],
 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
