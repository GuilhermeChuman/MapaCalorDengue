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
}