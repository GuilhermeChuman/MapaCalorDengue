import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private _matSnackBar: MatSnackBar
  ) { }

  public CasosMesGeoJson(): any{

    return this.http.get(environment.api_url+environment.casos_mes_geoJson).toPromise().then( (resp: any) =>{
        return resp;
    })  
  }

  public CasosMes(): any{

    return this.http.get(environment.api_url+environment.casos_mes).toPromise().then( (resp: any) =>{
        return resp;
    })  
  }

  public CasosByBairro(): any{

    return this.http.get(environment.api_url+environment.casos_by_bairro).toPromise().then( (resp: any) =>{
        return resp;
    })  
  }

  public CasosByMes(): any{

    return this.http.get(environment.api_url+environment.casos_by_mes).toPromise().then( (resp: any) =>{
        return resp;
    })  
  }

  public CasosByIdade(): any{

    return this.http.get(environment.api_url+environment.casos_by_idade).toPromise().then( (resp: any) =>{
        return resp;
    })  
  }
}