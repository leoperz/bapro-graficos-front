import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartDataSets } from 'chart.js';

import { Label, Color} from 'ng2-charts';
import { ProviderService } from 'src/app/services/provider.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
array:any[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };




  public barChartData: ChartDataSets[] = [
    { data: [0,0,0,0] , label: 'Desarrolladores' }
];

public barChartLabels: Label[] = ['Host','Mule', 'UX', 'FE'];

public barChartLegend = true;

public barChartColors: Color[] = [
  {
    backgroundColor: '#81008B',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }]

  constructor( private _p : ProviderService, private _ws: WebsocketService) {

    this.getdesarrolladores();

   }

  ngOnInit() {
    this._ws.esucucharEvento('mensaje-general-server').subscribe(
      (data:string[])=>{

        this.getdesarrolladores();
        /*this.barChartData[0].data.forEach(e => {
          this.array.push(e);
        });

        let cobol:number = 0;
        let mule:number = 0;
        let javascript:number = 0;
        let net:number = 0;

        for(let item of data){
            if(item === "Mule"){
              cobol = 1;
              return;
            }
            if(item==="Javascript"){
              javascript = 1;
              return;
            }
            if(item === ".net"){
              net = 1 ;
              return;
            }else{
              cobol = 1;
            }
           this.array[0] += cobol; 
           this.array[1] += mule;
           this.array[2] +=net;
           this.array[3] += javascript;

           this.barChartData[0].data = this.array;            
            
        }*/
      },
      error=>{

      }
    );
  }

  private getdesarrolladores(){
    this._p.getDesarrolladores().subscribe(
      (data:[])=>{
        
        this.barChartData[0].data=data;

      }, 
      error=>{

      }
    );
  }
}
