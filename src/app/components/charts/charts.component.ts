import { Component, OnInit } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  constructor(private _apiService: ApiService) { }

  async ngOnInit() {

    await this._apiService.CasosByBairro().then( (resp:any)=>{

            function compare( a: any, b: any ) {
              if ( a.nCasos > b.nCasos ){
                return -1;
              }
              if ( a.nCasos < b.nCasos ){
                return 1;
              }
              return 0;
            }
            
            const data: any = resp.sort( compare );
      
            const bairros: any[] = [];
            const casos: any[] = [];
            
            for(var i=0; i<5; i++){
              bairros.push(data[i].nome);
              casos.push(data[i].nCasos);
            }
      
            const ctx = document.getElementById('myChart') as ChartItem;
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: bairros,
                    datasets: [{
                        label: undefined,
                        data: casos,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins:{
                      legend:{
                        display:false
                      }
                    }
                }
            });
          });
      
          await this._apiService.CasosByMes().then( (resp:any)=>{
            const meses: any[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const casos: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            resp.forEach((element: any) => {
              casos[element.Mes-1] = element.nCasos;
            });
      
            const ctx2 = document.getElementById('myChart2') as ChartItem;
            const myChart2 = new Chart(ctx2, {
                  type: 'line',
                  data: {
                    labels: meses,
                    datasets: [{
                      label: '',
                      data: casos,
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }]
                  },
                  options:{
                    plugins:{
                      legend:{
                        display:false
                      }
                    }
                  }
            });
          });
      
          await this._apiService.CasosByIdade().then( (resp:any)=>{
            const idades: any[] = ['Até 10 anos', '11 a 20 anos', '21 a 40 anos', '41 a 70 anos', 'Acima de 70 anos'];
            const casos: any[] = [0, 0, 0, 0, 0];
            resp.forEach((element: any) => {
              if(element.Idade < 11)
                casos[0] = casos[0]+element.nCasos;
              else if(element.Idade < 21)
                casos[1] = casos[1]+element.nCasos;
              else if(element.Idade < 41)
                casos[2] = casos[2]+element.nCasos;
              else if(element.Idade < 71)
                casos[3] = casos[3]+element.nCasos;
              else
                casos[4] = casos[4]+element.nCasos;
            });
      
            const ctx3 = document.getElementById('myChart3') as ChartItem;
            const myChart3 = new Chart(ctx3, {
              type: 'bar',
              data: {
                labels: idades,
                datasets: [{
                  label: '',
                  data: casos,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
                  }]
              },
              options:{
                  scales: {
                    y: {
                        beginAtZero: true
                    }
                  },
                  plugins:{
                    legend:{
                      display:false
                    }
                  }
              }
            });
          });
  }

}
