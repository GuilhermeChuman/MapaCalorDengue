import { Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

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
      id: 'mapbox/light-v9',
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

  ngOnInit(): void {

  }

  select(value: any){
    if(!value)
      this.selected = false;

    else{
      this.selected = true;
      this.areaSelecionada.casos = value.casos;
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
      return d > 1000 ? '#800026' :
        d > 500  ? '#BD0026' :
        d > 200  ? '#E31A1C' :
        d > 100  ? '#FC4E2A' :
        d > 50   ? '#FD8D3C' :
        d > 20   ? '#FEB24C' :
        d > 10   ? '#FED976' : '#FFEDA0';
    }

    const legend = new L.Control({ position: 'bottomright' });
    
    legend.onAdd = map => {
    
      let div = L.DomUtil.create('div', 'infoLegend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [],
        from, to;

        div.style.backgroundColor = 'aliceblue';
        div.style.borderRadius = '5px';
        div.style.padding = '10px';
        div.style.boxShadow = '5px 5px 10px';

      
      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
      
        labels.push(
          '<i class="legendItem" style="display: inline-block !important; width: 10px !important; height: 10px !important; border: solid !important; border-width: thin !important; background:' + getColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }
      
      div.innerHTML = labels.join('<br>');
      return div;
    };
    
    legend.addTo(map);

    //const info = new L.Control({ position: 'topright' });

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
        fillColor: getColor(feature.properties.casos)
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

    let statesData: any;
    statesData = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Centro",
            "casos": 900
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.08325004577637,
                  -21.68434861544157
                ],
                [
                  -51.0780143737793,
                  -21.694985779863615
                ],
                [
                  -51.07101917266845,
                  -21.691945246028023
                ],
                [
                  -51.07136249542236,
                  -21.69112778008139
                ],
                [
                  -51.06874465942383,
                  -21.69003117213538
                ],
                [
                  -51.07050418853759,
                  -21.68698056430123
                ],
                [
                  -51.068830490112305,
                  -21.686222886981852
                ],
                [
                  -51.070804595947266,
                  -21.682753471522748
                ],
                [
                  -51.071791648864746,
                  -21.68315225915789
                ],
                [
                  -51.073637008666985,
                  -21.680041686337503
                ],
                [
                  -51.08325004577637,
                  -21.68434861544157
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Bela Vista"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.05642795562744,
                  -21.707476217365233
                ],
                [
                  -51.05741500854492,
                  -21.710008065399386
                ],
                [
                  -51.056835651397705,
                  -21.710825424151093
                ],
                [
                  -51.05702877044677,
                  -21.711423488589052
                ],
                [
                  -51.056878566741936,
                  -21.71158297201936
                ],
                [
                  -51.058058738708496,
                  -21.71419448804416
                ],
                [
                  -51.0544753074646,
                  -21.71419448804416
                ],
                [
                  -51.05254411697388,
                  -21.709529609341764
                ],
                [
                  -51.05599880218506,
                  -21.70819391109527
                ],
                [
                  -51.055848598480225,
                  -21.707536025312763
                ],
                [
                  -51.05642795562744,
                  -21.707476217365233
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Bandeirantes"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07367992401123,
                  -21.680001806762878
                ],
                [
                  -51.074130535125725,
                  -21.679264032642152
                ],
                [
                  -51.07674837112427,
                  -21.680340782795366
                ],
                [
                  -51.07636213302612,
                  -21.68111843068086
                ],
                [
                  -51.07367992401123,
                  -21.680001806762878
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim Brasil"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.06623411178588,
                  -21.69488609124746
                ],
                [
                  -51.06024742126465,
                  -21.686561848380446
                ],
                [
                  -51.06502175331116,
                  -21.68224501568742
                ],
                [
                  -51.06608390808105,
                  -21.683730499268528
                ],
                [
                  -51.066309213638306,
                  -21.68362083321897
                ],
                [
                  -51.06872320175171,
                  -21.68623285644614
                ],
                [
                  -51.07047200202942,
                  -21.686990533713086
                ],
                [
                  -51.06623411178588,
                  -21.69488609124746
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Christina"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07411175966263,
                  -21.679236615287852
                ],
                [
                  -51.07463210821152,
                  -21.67820222947482
                ],
                [
                  -51.07722043991089,
                  -21.679383671945295
                ],
                [
                  -51.07675909996032,
                  -21.680333305391486
                ],
                [
                  -51.07411175966263,
                  -21.679236615287852
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Cicma",
            "casos": 120
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.06566548347473,
                  -21.70038879962601
                ],
                [
                  -51.06642186641693,
                  -21.698943362173317
                ],
                [
                  -51.06550991535186,
                  -21.698574524085743
                ],
                [
                  -51.06712460517883,
                  -21.695269892041093
                ],
                [
                  -51.06624484062194,
                  -21.694881106814844
                ],
                [
                  -51.06871247291564,
                  -21.689986310723484
                ],
                [
                  -51.07135444879532,
                  -21.691130272362667
                ],
                [
                  -51.07101112604141,
                  -21.691930292424292
                ],
                [
                  -51.07184663414955,
                  -21.692305378181732
                ],
                [
                  -51.071424186229706,
                  -21.693153990526366
                ],
                [
                  -51.0723602771759,
                  -21.69355025713337
                ],
                [
                  -51.071566343307495,
                  -21.69516521919882
                ],
                [
                  -51.07416272163391,
                  -21.69630166312965
                ],
                [
                  -51.07297182083129,
                  -21.698724053154045
                ],
                [
                  -51.06939375400543,
                  -21.69722377113188
                ],
                [
                  -51.06817066669464,
                  -21.699715925375685
                ],
                [
                  -51.06751084327698,
                  -21.701136433993682
                ],
                [
                  -51.06566548347473,
                  -21.70038879962601
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Endo"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07922673225402,
                  -21.692573295981866
                ],
                [
                  -51.07967734336853,
                  -21.691705988182395
                ],
                [
                  -51.080589294433594,
                  -21.69207484386177
                ],
                [
                  -51.08150124549866,
                  -21.691785740841752
                ],
                [
                  -51.084301471710205,
                  -21.693021901415083
                ],
                [
                  -51.083550453186035,
                  -21.69447736719975
                ],
                [
                  -51.07922673225402,
                  -21.692573295981866
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Freitas"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07806801795959,
                  -21.67756913184527
                ],
                [
                  -51.07598662376404,
                  -21.676582092198604
                ],
                [
                  -51.07690930366516,
                  -21.6748971301148
                ],
                [
                  -51.0789155960083,
                  -21.675804419837963
                ],
                [
                  -51.07806801795959,
                  -21.67756913184527
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Jamil de Lima"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.06928110122681,
                  -21.68524089136969
                ],
                [
                  -51.06992483139038,
                  -21.684179132238608
                ],
                [
                  -51.066813468933105,
                  -21.679971897074683
                ],
                [
                  -51.066051721572876,
                  -21.68049033079153
                ],
                [
                  -51.064925193786614,
                  -21.67898487388189
                ],
                [
                  -51.06348752975464,
                  -21.679902107778062
                ],
                [
                  -51.063793301582336,
                  -21.680410571879563
                ],
                [
                  -51.06151342391968,
                  -21.681871149958084
                ],
                [
                  -51.05964660644531,
                  -21.67915436319367
                ],
                [
                  -51.06896996498108,
                  -21.67235469442799
                ],
                [
                  -51.072596311569214,
                  -21.675126445639005
                ],
                [
                  -51.07491374015808,
                  -21.67769874260996
                ],
                [
                  -51.071813106536865,
                  -21.68312235012353
                ],
                [
                  -51.070793867111206,
                  -21.68273353211203
                ],
                [
                  -51.06928110122681,
                  -21.68524089136969
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Jardim"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.064925193786614,
                  -21.67902475373788
                ],
                [
                  -51.066040992736816,
                  -21.680520240372147
                ],
                [
                  -51.066834926605225,
                  -21.679961927177235
                ],
                [
                  -51.06996774673462,
                  -21.684209041053624
                ],
                [
                  -51.068809032440186,
                  -21.686262764834844
                ],
                [
                  -51.066298484802246,
                  -21.68369062071472
                ],
                [
                  -51.06608390808105,
                  -21.683730499268528
                ],
                [
                  -51.06346607208252,
                  -21.67988216797283
                ],
                [
                  -51.064925193786614,
                  -21.67902475373788
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim America"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.083571910858154,
                  -21.689403111097416
                ],
                [
                  -51.08611464500427,
                  -21.687638544003853
                ],
                [
                  -51.08663499355316,
                  -21.688271597396394
                ],
                [
                  -51.085653305053704,
                  -21.690310309495505
                ],
                [
                  -51.083571910858154,
                  -21.689403111097416
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim Paulista"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07759594917297,
                  -21.695833130314867
                ],
                [
                  -51.08110427856445,
                  -21.697358348562773
                ],
                [
                  -51.08151197433472,
                  -21.696530944589874
                ],
                [
                  -51.08237028121948,
                  -21.69691972536201
                ],
                [
                  -51.08113646507263,
                  -21.69936204210073
                ],
                [
                  -51.076791286468506,
                  -21.69748794152549
                ],
                [
                  -51.07759594917297,
                  -21.695833130314867
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Joaquina"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.084526777267456,
                  -21.681836255773856
                ],
                [
                  -51.08326077461243,
                  -21.68434861544157
                ],
                [
                  -51.07893705368042,
                  -21.682384591977723
                ],
                [
                  -51.08016014099121,
                  -21.67994198738027
                ],
                [
                  -51.084526777267456,
                  -21.681836255773856
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "vila Nilza"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.078529357910156,
                  -21.698245559588884
                ],
                [
                  -51.07723116874695,
                  -21.700907159867004
                ],
                [
                  -51.07541799545288,
                  -21.70007977628669
                ],
                [
                  -51.076834201812744,
                  -21.69748794152549
                ],
                [
                  -51.078529357910156,
                  -21.698245559588884
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Olivero"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07800364494324,
                  -21.69496584214591
                ],
                [
                  -51.0775101184845,
                  -21.695992631018694
                ],
                [
                  -51.076544523239136,
                  -21.695563972476563
                ],
                [
                  -51.07576668262482,
                  -21.697034365645727
                ],
                [
                  -51.071566343307495,
                  -21.695140297082297
                ],
                [
                  -51.07236564159393,
                  -21.693542780415015
                ],
                [
                  -51.07144296169281,
                  -21.693146513787447
                ],
                [
                  -51.07186138629913,
                  -21.692314101094695
                ],
                [
                  -51.07800364494324,
                  -21.69496584214591
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {"Bairro":"Jardim Aviação"},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.06712460517883,
                  -21.69528484529807
                ],
                [
                  -51.06552600860596,
                  -21.698574524085743
                ],
                [
                  -51.06390595436096,
                  -21.697886688371533
                ],
                [
                  -51.06569766998291,
                  -21.694606962755103
                ],
                [
                  -51.06712460517883,
                  -21.69528484529807
                ]
              ]
            ]
          }
        }
      ]
    };

    var geojson;

    geojson = new L.GeoJSON(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);


  }

  scroll(value: any){

    let element = document.getElementById(value);
    if(element)
      element.scrollIntoView({block: "end", behavior: "smooth"});

  }
}