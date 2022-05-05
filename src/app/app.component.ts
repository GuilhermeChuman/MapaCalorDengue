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
            "Bairro": "Centro"
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
            "Bairro": "Vila Cicma"
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
          "properties": {
            "Bairro": "Jardim Aviação"
          },
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
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Jurema"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07806801795959,
                  -21.677579101908222
                ],
                [
                  -51.07722043991089,
                  -21.679403611819506
                ],
                [
                  -51.07467770576477,
                  -21.678197244464986
                ],
                [
                  -51.07563257217407,
                  -21.67646245057004
                ],
                [
                  -51.07806801795959,
                  -21.677579101908222
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Fátima"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.083550453186035,
                  -21.694437491620793
                ],
                [
                  -51.082348823547356,
                  -21.696939662809218
                ],
                [
                  -51.0780143737793,
                  -21.695005717578574
                ],
                [
                  -51.07925891876221,
                  -21.692553357930176
                ],
                [
                  -51.083550453186035,
                  -21.694437491620793
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Parque Cecap"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.085524559020996,
                  -21.694223160194763
                ],
                [
                  -51.08735918998718,
                  -21.690918428300087
                ],
                [
                  -51.088614463806145,
                  -21.69150660634079
                ],
                [
                  -51.086812019348145,
                  -21.69479637143391
                ],
                [
                  -51.085524559020996,
                  -21.694223160194763
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim Europa"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.086833477020264,
                  -21.694756495943295
                ],
                [
                  -51.088120937347405,
                  -21.692543388903307
                ],
                [
                  -51.09139859676361,
                  -21.693909139157356
                ],
                [
                  -51.09011113643646,
                  -21.696211944198016
                ],
                [
                  -51.086833477020264,
                  -21.694756495943295
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jd. Santa Inês"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07973635196686,
                  -21.695778301907126
                ],
                [
                  -51.079334020614624,
                  -21.69659075708468
                ],
                [
                  -51.077601313591,
                  -21.695823161515012
                ],
                [
                  -51.07800900936126,
                  -21.69497581100511
                ],
                [
                  -51.07973635196686,
                  -21.695778301907126
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Fudimori"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.08150124549866,
                  -21.69656583521486
                ],
                [
                  -51.08110427856445,
                  -21.697363332909642
                ],
                [
                  -51.079344749450684,
                  -21.696580788337272
                ],
                [
                  -51.07974708080292,
                  -21.69578328630869
                ],
                [
                  -51.08150124549866,
                  -21.69656583521486
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
                  -51.06998920440674,
                  -21.684149223417396
                ],
                [
                  -51.06568694114685,
                  -21.67846643474982
                ],
                [
                  -51.06751084327698,
                  -21.677329850127318
                ],
                [
                  -51.066405773162835,
                  -21.675819375115235
                ],
                [
                  -51.06743574142456,
                  -21.675136415870913
                ],
                [
                  -51.066899299621575,
                  -21.674398616847245
                ],
                [
                  -51.06874465942383,
                  -21.67328194087255
                ],
                [
                  -51.07037007808685,
                  -21.67550032886366
                ],
                [
                  -51.07117474079132,
                  -21.675011787922493
                ],
                [
                  -51.07170045375824,
                  -21.67571468814177
                ],
                [
                  -51.072585582733154,
                  -21.675136415870913
                ],
                [
                  -51.07491374015808,
                  -21.67770871266397
                ],
                [
                  -51.07187747955322,
                  -21.68315225915789
                ],
                [
                  -51.070804595947266,
                  -21.68273353211203
                ],
                [
                  -51.06998920440674,
                  -21.684149223417396
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim Oriente"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.0660195350647,
                  -21.68049033079153
                ],
                [
                  -51.0649037361145,
                  -21.679064633582843
                ],
                [
                  -51.06567621231079,
                  -21.678446494745966
                ],
                [
                  -51.066829562187195,
                  -21.67996691212604
                ],
                [
                  -51.0660195350647,
                  -21.68049033079153
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Parque Das Nações"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07895851135254,
                  -21.675814390022975
                ],
                [
                  -51.075847148895264,
                  -21.674219151648927
                ],
                [
                  -51.07850790023804,
                  -21.66917409411211
                ],
                [
                  -51.08151197433472,
                  -21.67049021309666
                ],
                [
                  -51.07895851135254,
                  -21.675814390022975
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim Adamantina"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.08144760131836,
                  -21.670550036401462
                ],
                [
                  -51.07848644256592,
                  -21.669154152822983
                ],
                [
                  -51.084151268005364,
                  -21.65599230059055
                ],
                [
                  -51.088056564331055,
                  -21.656989452648265
                ],
                [
                  -51.08144760131836,
                  -21.670550036401462
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim San Fernando"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.07752084732056,
                  -21.695992631018694
                ],
                [
                  -51.076319217681885,
                  -21.69842499486216
                ],
                [
                  -51.0744309425354,
                  -21.69755772230325
                ],
                [
                  -51.0749351978302,
                  -21.696630632067414
                ],
                [
                  -51.07577204704284,
                  -21.697039350003816
                ],
                [
                  -51.076565980911255,
                  -21.695573941294356
                ],
                [
                  -51.07752084732056,
                  -21.695992631018694
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
                  -51.07676982879638,
                  -21.68032084305082
                ],
                [
                  -51.076319217681885,
                  -21.68125800806231
                ],
                [
                  -51.073594093322754,
                  -21.680001806762878
                ],
                [
                  -51.074130535125725,
                  -21.67918427305153
                ],
                [
                  -51.07676982879638,
                  -21.68032084305082
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
                  -51.07713460922241,
                  -21.679353762128823
                ],
                [
                  -51.07668399810791,
                  -21.68030090330351
                ],
                [
                  -51.074098348617554,
                  -21.67914439323967
                ],
                [
                  -51.07467770576477,
                  -21.678177304423883
                ],
                [
                  -51.07713460922241,
                  -21.679353762128823
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
                  -51.077070236206055,
                  -21.679603010409835
                ],
                [
                  -51.07792854309082,
                  -21.680031716444873
                ],
                [
                  -51.0783576965332,
                  -21.679164333146975
                ],
                [
                  -51.08449459075927,
                  -21.681826286005393
                ],
                [
                  -51.08326077461243,
                  -21.68432867625156
                ],
                [
                  -51.07623338699341,
                  -21.6811981892011
                ],
                [
                  -51.077070236206055,
                  -21.679603010409835
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Vila Industrial"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.080074310302734,
                  -21.679902107778062
                ],
                [
                  -51.07838988304138,
                  -21.679164333146975
                ],
                [
                  -51.07793927192688,
                  -21.680001806762878
                ],
                [
                  -51.077027320861816,
                  -21.67962295025369
                ],
                [
                  -51.08067512512207,
                  -21.67221510842529
                ],
                [
                  -51.08243465423584,
                  -21.672962889005422
                ],
                [
                  -51.08044981956482,
                  -21.677050687621026
                ],
                [
                  -51.081275939941406,
                  -21.677459461107176
                ],
                [
                  -51.080074310302734,
                  -21.679902107778062
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Parque dos Lagos"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.046085357666016,
                  -21.688615538624525
                ],
                [
                  -51.04994773864746,
                  -21.69623188174321
                ],
                [
                  -51.04771614074707,
                  -21.697547753622782
                ],
                [
                  -51.0439395904541,
                  -21.6901308641118
                ],
                [
                  -51.046085357666016,
                  -21.688615538624525
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim Bela Vista"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.05247974395752,
                  -21.70956948074066
                ],
                [
                  -51.055076122283936,
                  -21.708373333968574
                ],
                [
                  -51.05516195297241,
                  -21.707157241225307
                ],
                [
                  -51.05569839477539,
                  -21.70741640939284
                ],
                [
                  -51.05597734451294,
                  -21.707356601395603
                ],
                [
                  -51.05644941329956,
                  -21.707476217365233
                ],
                [
                  -51.05743646621704,
                  -21.709828644564194
                ],
                [
                  -51.05715751647949,
                  -21.710506455434505
                ],
                [
                  -51.05670690536498,
                  -21.710785553100187
                ],
                [
                  -51.05700731277466,
                  -21.711443424027507
                ],
                [
                  -51.05685710906982,
                  -21.711642778260156
                ],
                [
                  -51.05814456939697,
                  -21.7142941632892
                ],
                [
                  -51.05471134185791,
                  -21.71451344858521
                ],
                [
                  -51.05247974395752,
                  -21.70956948074066
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Jardim dos Poetas"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.05597734451294,
                  -21.70737653739745
                ],
                [
                  -51.05891704559326,
                  -21.7055723180474
                ],
                [
                  -51.06001138687134,
                  -21.708104199574738
                ],
                [
                  -51.05914235115051,
                  -21.70840323775904
                ],
                [
                  -51.05848789215088,
                  -21.7089913443755
                ],
                [
                  -51.05814456939697,
                  -21.710018033216993
                ],
                [
                  -51.0578441619873,
                  -21.710037968850166
                ],
                [
                  -51.05745792388916,
                  -21.70986851588023
                ],
                [
                  -51.05648159980774,
                  -21.707436345386405
                ],
                [
                  -51.05624556541443,
                  -21.707396473396514
                ],
                [
                  -51.05597734451294,
                  -21.70737653739745
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Estância Dorigo"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.0589063167572,
                  -21.705592254296377
                ],
                [
                  -51.06000065803527,
                  -21.704625343039925
                ],
                [
                  -51.060580015182495,
                  -21.70391759975585
                ],
                [
                  -51.06118083000183,
                  -21.703219821280506
                ],
                [
                  -51.0619854927063,
                  -21.702890867397578
                ],
                [
                  -51.062586307525635,
                  -21.702930740635548
                ],
                [
                  -51.063069105148315,
                  -21.703150043246943
                ],
                [
                  -51.063348054885864,
                  -21.70342915517824
                ],
                [
                  -51.06342315673828,
                  -21.703598615729664
                ],
                [
                  -51.063315868377686,
                  -21.703987377417356
                ],
                [
                  -51.06266140937805,
                  -21.704764897642956
                ],
                [
                  -51.06227517127991,
                  -21.704615374848803
                ],
                [
                  -51.05975389480591,
                  -21.7074961533505
                ],
                [
                  -51.0589063167572,
                  -21.705592254296377
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Residencial Parque Tangará"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.08044981956482,
                  -21.677020777320426
                ],
                [
                  -51.08242392539978,
                  -21.672972859386967
                ],
                [
                  -51.08500957489014,
                  -21.67399980499204
                ],
                [
                  -51.083024740219116,
                  -21.67810751425831
                ],
                [
                  -51.08044981956482,
                  -21.677020777320426
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "Bairro": "Parque Residencial Iguaçu"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.086629629135125,
                  -21.688286551379907
                ],
                [
                  -51.08438730239868,
                  -21.685465205677993
                ],
                [
                  -51.08535289764404,
                  -21.68474739866218
                ],
                [
                  -51.08697295188904,
                  -21.685116272158627
                ],
                [
                  -51.087327003479004,
                  -21.68527578472947
                ],
                [
                  -51.08776688575744,
                  -21.685764290879174
                ],
                [
                  -51.0877776145935,
                  -21.685973650150608
                ],
                [
                  -51.08770251274109,
                  -21.68621291751688
                ],
                [
                  -51.086629629135125,
                  -21.688286551379907
                ]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {"Bairro":"Jardim Ipiranga"},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -51.08537435531616,
                  -21.68474739866218
                ],
                [
                  -51.08437657356262,
                  -21.685455236160593
                ],
                [
                  -51.08611464500427,
                  -21.68761860526913
                ],
                [
                  -51.08359336853027,
                  -21.689403111097416
                ],
                [
                  -51.082788705825806,
                  -21.68908409491834
                ],
                [
                  -51.08196258544922,
                  -21.689363234113657
                ],
                [
                  -51.08171582221985,
                  -21.68955264968815
                ],
                [
                  -51.081554889678955,
                  -21.68995141850457
                ],
                [
                  -51.08067512512207,
                  -21.689602495850565
                ],
                [
                  -51.083303689956665,
                  -21.684308737058814
                ],
                [
                  -51.08537435531616,
                  -21.68474739866218
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
      element.scrollIntoView({block: "center", behavior: "smooth"});

  }
}