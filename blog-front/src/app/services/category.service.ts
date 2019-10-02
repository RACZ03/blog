import{Injectable, Inject} from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpRequest,HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable , Subject} from 'rxjs';
import { GLOBAL } from './global';



@Injectable ()
export class CategoryService{
    public url: string;

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
    register(token, cat_to_register):Observable<any>{
        let params = JSON.stringify(cat_to_register); 
        let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  token
        })};
        //console.log('parametros: ',params);
        //console.log(_options.get('Content-Type'));
        return this._http.post(this.url+'category/register', params, headers);
        
        }

    //actualizar categoria
   updateCategory(token, cat_to_update):Observable<any>{
    let params = JSON.stringify(cat_to_update);
    let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  token
        })};
        return this._http.put(this.url+'category/update/'+cat_to_update._id, params,headers);

 }

 getCategories():Observable<any>{
    
    let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })};
    return this._http.get(this.url+'categories',headers);
}
getCategory(id):Observable<any>{
    
    let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })};
    return this._http.get(this.url+'category/'+id,headers);
}

deleteCategory(token, idAdmin, idcategory):Observable<any>{
    let headers = {headers :  new HttpHeaders({
        'Content-Type': 'application/json',
         'Authorization': token
    })};
  return this._http.delete(this.url+'category/delete'+idAdmin+'/'+idcategory, headers);
}

}
