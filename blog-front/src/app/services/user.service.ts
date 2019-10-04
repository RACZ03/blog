import{Injectable, Inject} from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpRequest,HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable , Subject} from 'rxjs';
import { GLOBAL } from './global';



@Injectable ()
export class UserService{
    public url: string;
    public identity;
    public token;
    isAdmin:boolean;
    
    

    constructor(private _http: HttpClient){
        this.url=GLOBAL.url;
    }
    //Metodo para refrescar tabla
    private  _refrescarTabla = new Subject<void>();
    get refrescarTabla(){
        return this._refrescarTabla;
    }
    //metodo de usuarios
    //Registrar Usuario
    register(idAdmin, user_to_register):Observable<any>{
        let params = JSON.stringify(user_to_register); 
        let headers = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  this.getToken()
        })};
        //console.log('parametros: ',params);
        //console.log(_options.get('Content-Type'));
        return this._http.post(this.url+'user/register/'+idAdmin, params, headers);
        
        }
     //Login
    singup(user_to_login, gettoken=null):Observable<any>{
        if(gettoken != null){
            user_to_login.gettoken = gettoken;

        }
        let params = JSON.stringify(user_to_login);
        let options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this._http.post(this.url+'login', params, options);

    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity && identity != "undefined")
        {
           this.identity = identity;
       
           if(this.identity.role == "ROLE_ADMIN")
           {
                 this.isAdmin = true;
           }
        }
        else{
            this.identity = null;
        }

        return this.identity;
   }

   

    getToken(){
        let token = JSON.stringify(localStorage.getItem('token'));
       
        if(token != "undefined"){
          this.token = token;
        }else{
            this.token=null;
        }
        return this.token;
    }

    //actualizar usuario
   update(user):Observable<any>{
         //Convertir el objeto de usuario a un json string
         let params = JSON.stringify(user);
         //Definir las cabeceras
         let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization', this.getToken());

         //Hacer la peticion ajax

         return this._http.put(this.url+'user/update', params, {headers: headers});
     }

 getUsers(idAdmin):Observable<any>{
    
    let headers = {
        headers: new HttpHeaders({
        'Authorization':  this.getToken()
        })};
    return this._http.get(this.url+'users/'+idAdmin,headers);
}

deleteUser(token,idAdmin, id):Observable<any>{
    let headers = {headers :  new HttpHeaders({
        'Content-Type': 'application/json',
         'Authorization': this.getToken()
    })};
  return this._http.delete(this.url+'user/delete/'+idAdmin+'/'+id, headers);
}

}
