import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Chart, ChartItem, registerables } from 'chart.js';
Chart.register(...registerables);
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  constructor(public _apiService: ApiService) { }

  dataSourceMaps: any;
  dataRural: any = '';
  isReady = false;
  gravidadeRural: any;

  southBound = L.latLng(-21.72694024964517, -51.10437230961509);
  northBound = L.latLng(-21.649681004734106, -51.03724982481903);

  info = new L.Control({ position: 'topright' })

  MyMap: any;

  selected = false;
  areaSelecionada = {
    name: 'El Dorado',
    casos: '20'
  } 

  options = {
    layers: [
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
      { maxZoom: 18, attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1 }),
    
    ],
    zoom: 13,
    minZoom: 13,
    center: L.latLng(-21.68187739161402, -51.074780676525265),
    maxBounds: L.latLngBounds(this.southBound, this.northBound)
  };

  legenda = {
  baseLayers: {
    'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    'Open Cycle Map': L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  },
  overlays: {}

}

title = 'MapaCalorDengue';

  async ngOnInit(){

    await this._apiService.CasosMes().then( (resp:any)=>{
      resp.forEach((element:any) => {
        if(element.nome == 'ZONA RURAL')
          this.dataRural = element.nCasos;
          this.gravidadeRural =  this.dataRural > 19 ? 'red' :
                                 this.dataRural > 14  ? 'darkOrange' :
                                 this.dataRural > 9   ? 'orange' : 
                                 this.dataRural > 4   ? 'lightOrange' :
                                 this.dataRural > 0   ? 'yellow' : 'lightYellow';
      });
    });

    await this._apiService.CasosMesGeoJson().then( (resp:any)=>{
      this.dataSourceMaps = resp;
      this.isReady = true;
    });
  }

  select(value: any){
    if(!value)
      this.selected = false;

    else{
      this.selected = true;
      this.areaSelecionada.casos = value.Casos;
      this.areaSelecionada.name = value.Bairro;
    }
  }

  infoAdd(){

    this.info.onAdd = map => {
    
      let div = L.DomUtil.create('div', 'info');

      let labels = [
        '<b style="color: #585858;">CASOS REGISTRADOS NOS ÚLTIMOS 30 DIAS</b>',
        this.selected ? '<b>'+this.areaSelecionada.name+'</b> <br />'+ this.areaSelecionada.casos+' casos' : 'Selecione uma região'
      ];

      div.style.backgroundColor = 'aliceblue';
      div.style.borderRadius = '5px';
      div.style.padding = '10px';
      div.style.boxShadow = '5px 5px 10px';
      
      div.innerHTML = labels.join('<br>');
      return div;
    };
  
    this.info.addTo(this.MyMap);
  }


  onMapReady(map: any) {

        this.MyMap = map;
        
        function getColor(d: any) {
          return d > 19 ? '#FF0100' :
            d > 14  ? '#FD6000' :
            d > 9   ? '#FF9B00' : 
            d > 4   ? '#FFD81B' :
            d > 0   ? '#FFFF00' : '#FFEDA0';
        }
                
        this.info.onAdd = map => {
        
          let div = L.DomUtil.create('div', 'info');
    
          let labels = [
            '<b style="color: #585858;">CASOS REGISTRADOS NOS ÚLTIMOS 30 DIAS</b>',
            this.selected ? '<b>'+this.areaSelecionada.name+'</b> <br />'+ this.areaSelecionada.casos+' casos' : 'Selecione uma região'
          ];
    
          div.style.backgroundColor = 'aliceblue';
          div.style.borderRadius = '5px';
          div.style.padding = '10px';
          div.style.boxShadow = '5px 5px 10px';
          
          div.innerHTML = labels.join('<br>');
          return div;
        };
        
        this.info.addTo(map);
    
        function style(feature: any) {
          return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.Casos)
          };
        }
    
        function onEachFeature(feature:any, layer:any) {
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
          });
        }
    
        const highlightFeature = (e: any) => {
          var layer = e.target;
      
          layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
          });
      
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
          
          this.info.remove();
          this.select(layer.feature.properties);
          this.infoAdd();
    
    ;
        }
      
        var geojson: any;
      
        const resetHighlight = (e: any) => {
          geojson.resetStyle(e.target);
          this.info.remove();
          this.select(false);
          this.infoAdd();
    
        }
      
        function zoomToFeature(e: any) {
          map.fitBounds(e.target.getBounds());
        }
    
        var geojson;
    
        geojson = new L.GeoJSON(this.dataSourceMaps, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(map);
    
    
      }

}
