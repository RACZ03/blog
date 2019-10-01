import{Injectable, Inject} from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpRequest,HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable , Subject} from 'rxjs';
import { GLOBAL } from './global';



@Injectable ()
export class NewsService{
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
    register(token, news_to_register):Observable<any>{
        let params = JSON.stringify(news_to_register); 
        let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  token
        })};
        //console.log('parametros: ',params);
        //console.log(_options.get('Content-Type'));
        return this._http.post(this.url+'news/register', params, headers);
        
        }

    //actualizar categoria
   updateNews(token, news_to_update):Observable<any>{
        let params = JSON.stringify(news_to_update);
        let headers = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':  token
            })};
            return this._http.put(this.url+'news/update/'+news_to_update._id, params,headers);
     }

    getNews():Observable<any>{
         let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'news',{headers: headers});
    }
    getNew(token, id):Observable<any>{
         let headers = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json'
            })};
        return this._http.get(this.url+'news/'+id, headers);
    }
    deleteNews(token, id):Observable<any>{
        let headers = {headers :  new HttpHeaders({
            'Content-Type': 'application/json',
             'Authorization': token
        })};
      return this._http.delete(this.url+'news/delete/'+id, headers);
    }

}