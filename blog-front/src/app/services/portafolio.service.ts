import{Injectable, Inject} from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpRequest,HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable , Subject} from 'rxjs';
import { GLOBAL } from './global';



@Injectable ()
export class PortafolioService{
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
    //Registrar portafolio
    register(token, portafolio_to_register):Observable<any>{
        let params = JSON.stringify(portafolio_to_register); 
        let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  token
        })};
        //console.log('parametros: ',params);
        //console.log(_options.get('Content-Type'));
        return this._http.post(this.url+'portafolio/register', params, headers);
        
        }

    //actualizar portafolio
   updatePortafolio(token, portafolio_to_update):Observable<any>{
        let params = JSON.stringify(portafolio_to_update);
        let headers = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':  token
            })};
            return this._http.put(this.url+'portafolio/update/'+portafolio_to_update._id, params,headers);
     }

    getPortafolios():Observable<any>{
         let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'portafolios',{headers: headers});
    }
    getPortafolio(token, id):Observable<any>{
         let headers = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':  token
            })};
        return this._http.get(this.url+'portafolio/'+id, headers);
    }
    deletePortafolio(token, idAdmin, id):Observable<any>{
        let headers = {headers :  new HttpHeaders({
            'Content-Type': 'application/json',
             'Authorization': token
        })};
      return this._http.delete(this.url+'portafolio/delete/'+idAdmin+'/'+id, headers);
    }

}