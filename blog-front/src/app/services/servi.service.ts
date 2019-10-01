import{Injectable, Inject} from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpRequest,HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable , Subject} from 'rxjs';
import { GLOBAL } from './global';



@Injectable ()
export class ServiService{
    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient){
        this.url=GLOBAL.url;
    }

    //Metodo para refrescar tabla
    private  _refrescarTabla = new Subject<void>();
    get refrescarTabla(){
        return this._refrescarTabla;
    }
    //metodo de categorias
    //Registrar categoria
    register(token, service_to_register):Observable<any>{
        let params = JSON.stringify(service_to_register); 
        let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  token
        })};
        //console.log('parametros: ',params);
        //console.log(_options.get('Content-Type'));
        return this._http.post(this.url+'service/register', params, headers);
        
        }

    //actualizar categoria
   updateService(token, service_to_update):Observable<any>{
        let params = JSON.stringify(service_to_update);
        let headers = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':  token
            })};
            return this._http.put(this.url+'service/update/'+service_to_update._id, params,headers);
     }

    getServices():Observable<any>{
         let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'services',{headers: headers});
    }
    getService(token, id):Observable<any>{
         let headers = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':  token
            })};
        return this._http.get(this.url+'service/'+id, headers);
    }
    deleteService(token, id):Observable<any>{
        let headers = {headers :  new HttpHeaders({
            'Content-Type': 'application/json',
             'Authorization': token
        })};
      return this._http.delete(this.url+'service/delete/'+id, headers);
    }

}