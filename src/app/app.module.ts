import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { AppComponent } from './app.component';
import {ChartsModule} from 'ng2-charts';
import {HttpClientModule} from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent, NgbdModalContent, NgbdModalContentEquipos} from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { PerfilComponent } from './components/perfil/perfil.component';
import {MatInputModule, MatButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { IncidenteComponent } from './components/incidente/incidente.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';
import { ListaIncidentesComponent } from './components/lista-incidentes/lista-incidentes.component';
import {LineChartComponent} from './components/line-chart/line-chart.component';
import { UploadComponent } from './components/upload/upload.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MensajeComponent } from './components/mensaje/mensaje.component';
import { ListaIncidentesAsignadosComponent } from './components/lista-incidentes-asignados/lista-incidentes-asignados.component';
import {DataTablesModule} from 'angular-datatables';









const config: SocketIoConfig = {url:'http://localhost:5500', options:{}};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    PerfilComponent,
    IncidenteComponent,
    ListaIncidentesComponent,
    LineChartComponent,
    UploadComponent,
    NgbdModalContent,
    NgbdModalContentEquipos,
    PieChartComponent,
    MensajeComponent,
    ListaIncidentesAsignadosComponent
    
    

    
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
    NgbModule,
    FileUploadModule,
    AngularMultiSelectModule,
    DataTablesModule
    
    
    
   
  ],
 
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[NgbdModalContent, NgbdModalContentEquipos]
})
export class AppModule { }
