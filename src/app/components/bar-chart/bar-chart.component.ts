import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartDataSets } from 'chart.js';

import { Label, Color} from 'ng2-charts';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {


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

  constructor( private _p : ProviderService) {

    this._p.getDesarrolladores().subscribe(
      (data:[])=>{
        
        this.barChartData[0].data=data;

      }, 
      error=>{

      }
    );

   }

  ngOnInit() {
  }

}
