import { Component, OnInit } from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

Chart.register(...registerables);
import * as L from 'leaflet';
import { ApiService } from './api.service';
  
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver, private router: Router) {}

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
}

// export class AppComponent implements OnInit{

//   constructor(public _apiService: ApiService){

//   }

//   dataSourceMaps: any;
//   isReady = false;

//   southBound = L.latLng(-21.72694024964517, -51.10437230961509);
//   northBound = L.latLng(-21.649681004734106, -51.03724982481903);

//   info = new L.Control({ position: 'topright' })

//   MyMap: any;
  
//   selected = false;
//   areaSelecionada = {
//     name: 'El Dorado',
//     casos: '20'
//   }

//   options = {
//     layers: [
//       L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
//       { maxZoom: 18, attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
//       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a> | Dados Atualizados em: 08/05/2022',
//       id: 'mapbox/light-v9',
//       tileSize: 512,
//       zoomOffset: -1 }),
      
//     ],
//     zoom: 13,
//     minZoom: 13,
//     center: L.latLng(-21.68187739161402, -51.074780676525265),
//     maxBounds: L.latLngBounds(this.southBound, this.northBound)

//   };

//   legenda = {
//     baseLayers: {
//       'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
//       'Open Cycle Map': L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
//     },
//     overlays: {}
    
//   }

  
//   title = 'MapaCalorDengue';

//   async ngOnInit() {
//     await this._apiService.CasosMesGeoJson().then( (resp:any)=>{
//       this.dataSourceMaps = resp;
//       this.isReady = true;

      
//     });

//     await this._apiService.CasosByBairro().then( (resp:any)=>{

//       function compare( a: any, b: any ) {
//         if ( a.nCasos > b.nCasos ){
//           return -1;
//         }
//         if ( a.nCasos < b.nCasos ){
//           return 1;
//         }
//         return 0;
//       }
      
//       const data: any = resp.sort( compare );

//       const bairros: any[] = [];
//       const casos: any[] = [];
      
//       for(var i=0; i<5; i++){
//         bairros.push(data[i].nome);
//         casos.push(data[i].nCasos);
//       }

//       const ctx = document.getElementById('myChart') as ChartItem;
//       const myChart = new Chart(ctx, {
//           type: 'bar',
//           data: {
//               labels: bairros,
//               datasets: [{
//                   label: undefined,
//                   data: casos,
//                   backgroundColor: [
//                       'rgba(255, 99, 132, 0.2)',
//                       'rgba(54, 162, 235, 0.2)',
//                       'rgba(255, 206, 86, 0.2)',
//                       'rgba(75, 192, 192, 0.2)',
//                       'rgba(153, 102, 255, 0.2)',
//                       'rgba(255, 159, 64, 0.2)'
//                   ],
//                   borderColor: [
//                       'rgba(255, 99, 132, 1)',
//                       'rgba(54, 162, 235, 1)',
//                       'rgba(255, 206, 86, 1)',
//                       'rgba(75, 192, 192, 1)',
//                       'rgba(153, 102, 255, 1)',
//                       'rgba(255, 159, 64, 1)'
//                   ],
//                   borderWidth: 1
//               }]
//           },
//           options: {
//               indexAxis: 'y',
//               scales: {
//                   y: {
//                       beginAtZero: true
//                   }
//               },
//               plugins:{
//                 legend:{
//                   display:false
//                 }
//               }
//           }
//       });
//     });

//     await this._apiService.CasosByMes().then( (resp:any)=>{
//       const meses: any[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
//       const casos: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//       resp.forEach((element: any) => {
//         casos[element.Mes-1] = element.nCasos;
//       });

//       const ctx2 = document.getElementById('myChart2') as ChartItem;
//       const myChart2 = new Chart(ctx2, {
//             type: 'line',
//             data: {
//               labels: meses,
//               datasets: [{
//                 label: '',
//                 data: casos,
//                 fill: false,
//                 borderColor: 'rgb(75, 192, 192)',
//                 tension: 0.1
//               }]
//             },
//             options:{
//               plugins:{
//                 legend:{
//                   display:false
//                 }
//               }
//             }
//       });
//     });

//     await this._apiService.CasosByIdade().then( (resp:any)=>{
//       const idades: any[] = ['Até 10 anos', '11 a 20 anos', '21 a 40 anos', '41 a 70 anos', 'Acima de 70 anos'];
//       const casos: any[] = [0, 0, 0, 0, 0];
//       resp.forEach((element: any) => {
//         if(element.Idade < 11)
//           casos[0] = casos[0]+element.nCasos;
//         else if(element.Idade < 21)
//           casos[1] = casos[1]+element.nCasos;
//         else if(element.Idade < 41)
//           casos[2] = casos[2]+element.nCasos;
//         else if(element.Idade < 71)
//           casos[3] = casos[3]+element.nCasos;
//         else
//           casos[4] = casos[4]+element.nCasos;
//       });

//       const ctx3 = document.getElementById('myChart3') as ChartItem;
//       const myChart3 = new Chart(ctx3, {
//         type: 'bar',
//         data: {
//           labels: idades,
//           datasets: [{
//             label: '',
//             data: casos,
//             backgroundColor: [
//               'rgba(255, 99, 132, 0.2)',
//               'rgba(54, 162, 235, 0.2)',
//               'rgba(255, 206, 86, 0.2)',
//               'rgba(75, 192, 192, 0.2)',
//               'rgba(153, 102, 255, 0.2)',
//               'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//             }]
//         },
//         options:{
//             scales: {
//               y: {
//                   beginAtZero: true
//               }
//             },
//             plugins:{
//               legend:{
//                 display:false
//               }
//             }
//         }
//       });
//     });

    



//   }

//   select(value: any){
//     if(!value)
//       this.selected = false;

//     else{
//       this.selected = true;
//       this.areaSelecionada.casos = value.Casos;
//       this.areaSelecionada.name = value.Bairro;
//     }
//   }

//   infoAdd(){

//     this.info.onAdd = map => {
    
//       let div = L.DomUtil.create('div', 'info');

//       let labels = [
//         '<b style="color: #585858;">CASOS REGISTRADOS NOS ÚLTIMOS 30 DIAS</b>',
//         this.selected ? '<b>'+this.areaSelecionada.name+'</b> <br />'+ this.areaSelecionada.casos+' casos' : 'Selecione uma região'
//       ];

//       div.style.backgroundColor = 'aliceblue';
//       div.style.borderRadius = '5px';
//       div.style.padding = '10px';
//       div.style.boxShadow = '5px 5px 10px';
      
//       div.innerHTML = labels.join('<br>');
//       return div;
//     };
  
//     this.info.addTo(this.MyMap);
//   }

//   onMapReady(map: any) {

//     this.MyMap = map;
    
//     function getColor(d: any) {
//       return d > 100 ? '#69000E' :
//         d > 75  ? '#E31D1A' :
//         d > 50   ? '#E3531A' :
//         d > 20   ? '#E3931A' :
//         d > 10   ? '#E0DB4C' : '#FFEDA0';
//     }

//     const legend = new L.Control({ position: 'bottomright' });
    
//     legend.onAdd = map => {
    
//       let div = L.DomUtil.create('div', 'infoLegend'),
//         grades = [0, 10, 20, 50, 75, 100],
//         labels = [],
//         from, to;

//         div.style.backgroundColor = 'aliceblue';
//         div.style.borderRadius = '5px';
//         div.style.padding = '10px';
//         div.style.boxShadow = '5px 5px 10px';

      
//       for (var i = 0; i < grades.length; i++) {
//         from = grades[i];
//         to = grades[i + 1];
      
//         labels.push(
//           '<i class="legendItem" style="display: inline-block !important; width: 10px !important; height: 10px !important; border: solid !important; border-width: thin !important; background:' + getColor(from + 1) + '"></i> ' +
//           from + (to ? '&ndash;' + to : '+'));
//       }
      
//       div.innerHTML = labels.join('<br>');
//       return div;
//     };
    
//     legend.addTo(map);

//     //const info = new L.Control({ position: 'topright' });

//     this.info.onAdd = map => {
    
//       let div = L.DomUtil.create('div', 'info');

//       let labels = [
//         '<b style="color: #585858;">CASOS REGISTRADOS NOS ÚLTIMOS 30 DIAS</b>',
//         this.selected ? '<b>'+this.areaSelecionada.name+'</b> <br />'+ this.areaSelecionada.casos+' casos' : 'Selecione uma região'
//       ];

//       div.style.backgroundColor = 'aliceblue';
//       div.style.borderRadius = '5px';
//       div.style.padding = '10px';
//       div.style.boxShadow = '5px 5px 10px';
      
//       div.innerHTML = labels.join('<br>');
//       return div;
//     };
    
//     this.info.addTo(map);

//     function style(feature: any) {
//       return {
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.7,
//         fillColor: getColor(feature.properties.Casos)
//       };
//     }

//     function onEachFeature(feature:any, layer:any) {
//       layer.on({
//         mouseover: highlightFeature,
//         mouseout: resetHighlight,
//         click: zoomToFeature
//       });
//     }

//     const highlightFeature = (e: any) => {
//       var layer = e.target;
  
//       layer.setStyle({
//         weight: 5,
//         color: '#666',
//         dashArray: '',
//         fillOpacity: 0.7
//       });
  
//       if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//         layer.bringToFront();
//       }
      
//       this.info.remove();
//       this.select(layer.feature.properties);
//       this.infoAdd();

// ;
//     }
  
//     var geojson: any;
  
//     const resetHighlight = (e: any) => {
//       geojson.resetStyle(e.target);
//       this.info.remove();
//       this.select(false);
//       this.infoAdd();

//     }
  
//     function zoomToFeature(e: any) {
//       map.fitBounds(e.target.getBounds());
//     }

//     var geojson;

//     geojson = new L.GeoJSON(this.dataSourceMaps, {
//       style: style,
//       onEachFeature: onEachFeature
//     }).addTo(map);


//   }

//   scroll(value: any){

//     let element = document.getElementById(value);
//     if(element)
//       element.scrollIntoView({block: "start", behavior: "smooth"});

//   }
// }