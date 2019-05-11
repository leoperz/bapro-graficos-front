import { Component, OnInit } from '@angular/core';
import { ChartDataSets , ChartOptions, ChartType} from 'chart.js';
import {  Label } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import {WebsocketService} from '../../services/websocket.service';



@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css']
})
export class GraficaComponent implements OnInit {

 
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  value: string ='';

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Ventas' },
   
  ];
  public lineChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'Abril'];

 


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };


  public barChartLabels: Label[] = ['Roberto', 'Javier', 'Felipe', 'Matias', 'German', 'Ignacio', 'Alfredo'];
  public barChartType: ChartType = 'bar';
  
  public barChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];

  
  constructor(private http: HttpClient, private _socket: WebsocketService) { 

  }


  ngOnInit() {  

    this.dropdownList = [
      { item_id: 1, item_text: 'Roberto' },
      { item_id: 2, item_text: 'Javier' },
      { item_id: 3, item_text: 'Felipe' },
      { item_id: 4, item_text: 'Matias' },
      { item_id: 5, item_text: 'German' },
      { item_id: 6, item_text: 'Ignacio' },
      { item_id: 7, item_text: 'Alfredo' }
    ];
    this.selectedItems = [
      
    ];


    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };



   this.getData();
   this.getBarChartData();
  // this.escucharEvento();
  // this.escucharEventoBarras();
  }

  getData(){
    this.http.get('http://localhost:5500/grafica').subscribe(
      data=>{
        console.log(data);
      },
      error=>{
        console.log('entro por error');
        console.log("Ha ocurrido un error inespecifico",error);
      }
      
     
    )}

  /*escucharEvento(){
    this._socket.escucharEvento('notificacion').subscribe(data=>{
      console.log("esta es la notificacion que llega: ",data);
    });
      
    
  }*/

 /* escucharEventoBarras(){
    this._socket.escucharEvento('cambio-grafico-barras').subscribe((data:any)=>{
      this.barChartData = data;  
      
    });
  }*/


  getBarChartData(){
    this.http.get('http://localhost:5500/barras').subscribe((data:any)=>{
      this.barChartData = data;
      
    }); 
  }


  onItemSelect(item: any) {
    console.log(item);
    this.value = item.item_text;
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  votar(){
    
    let json = {email:'sadsad.com', lastname: 'roberto', firstname:'gomez'};
    this.http.post('http://localhost:5500/grafica',json).subscribe((data:any)=>{
      
    });
  }

}
